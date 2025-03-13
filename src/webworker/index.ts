// Do strong type WebWorker as soon as it is possible:
// https://github.com/microsoft/TypeScript/issues/14877
// At the moment "webworker" lib conflicts with  jest-environment-jsdom that uses "dom" lib
import { Type as MType } from '../common/messages.gen.js'
import { FromWorkerData } from '../common/interaction.js'

import QueueSender from './QueueSender.js'
import BatchWriter from './BatchWriter.js'

declare function postMessage(message: FromWorkerData, transfer?: any[]): void

enum WorkerStatus {
  NotActive,
  Starting,
  Stopping,
  Active,
  Stopped,
}

const AUTO_SEND_INTERVAL = 10 * 1000

let sender: QueueSender | null = null
let writer: BatchWriter | null = null
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let workerStatus: WorkerStatus = WorkerStatus.NotActive

function finalize(): void {
  if (!writer) {
    return
  }
  writer.finaliseBatch() // TODO: force sendAll?
}

function resetWriter(): void {
  if (writer) {
    writer.clean()
    // we don't need to wait for anything here since its sync
    writer = null
  }
}

function resetSender(): void {
  if (sender) {
    sender.clean()
    // allowing some time to send last batch
    setTimeout(() => {
      sender = null
    }, 20)
  }
}

function reset(): void {
  workerStatus = WorkerStatus.Stopping
  if (sendIntervalID !== null) {
    clearInterval(sendIntervalID)
    sendIntervalID = null
  }
  resetWriter()
  resetSender()
  setTimeout(() => {
    workerStatus = WorkerStatus.NotActive
  }, 100)
}

function initiateRestart(): void {
  if (workerStatus === WorkerStatus.Stopped) return
  postMessage('restart')
  reset()
}
function initiateFailure(reason: string): void {
  postMessage({ type: 'failure', reason })
  reset()
}

let sendIntervalID: ReturnType<typeof setInterval> | null = null
let restartTimeoutID: ReturnType<typeof setTimeout>

// Wait for queued data to be sent over network with potential timeout after 3 seconds by default
async function waitForNetworkCompletion(retries = 30): Promise<boolean> {
  // If no sender or empty queue, we're already done
  if (!sender || sender['queue'].length === 0) {
    return false
  }

  // Keep track of last item in queue
  const lastItem = sender['queue'][sender['queue'].length - 1];

  // Check if the last item is still in the queue until max retries are reached
  for (let i = 0; i < retries; i++) {
    // If sender is gone, we are done
    if (!sender) {
      return false
    }

    // Check if the last item is still in the queue
    const itemStillInQueue = sender['queue'].includes(lastItem);
    if (!itemStillInQueue) {
      return false
    }

    // Wait before next check
    await new Promise((f) => setTimeout(f, 100));
  }

  console.warn(
    'OpenReplay: waitForNetworkCompletion - Network completion timeout reached. Some data may not have been sent.',
  )
  return true
}

function postFlushMessageAfterNetworkCompletion(): void {
  void waitForNetworkCompletion()
    .then((timedOut) => {
      postMessage({
        type: 'force_flush_completed',
        timedOut,
      })
    })
    .catch((error) => {
      console.error(
        'OpenReplay: postFlushMessageAfterNetworkCompletion - Error during network completion:',
        error,
      )
    })
}

// @ts-ignore
self.onmessage = ({ data }: { data: ToWorkerData }): any => {
  if (data == null) {
    finalize()
    return
  }
  if (data === 'stop') {
    finalize()
    reset()
    return (workerStatus = WorkerStatus.Stopped)
  }
  if (data === 'forceFlushBatch') {
    finalize()
    void postFlushMessageAfterNetworkCompletion()
    return
  }

  if (Array.isArray(data)) {
    if (writer !== null) {
      const w = writer
      data.forEach((message) => {
        if (message[0] === MType.SetPageVisibility) {
          if (message[1]) {
            // .hidden
            restartTimeoutID = setTimeout(() => initiateRestart(), 30 * 60 * 1000)
          } else {
            clearTimeout(restartTimeoutID)
          }
        }
        w.writeMessage(message)
      })
    }
    if (!writer) {
      postMessage('not_init')
      initiateRestart()
    }
    return
  }

  if (data.type === 'compressed') {
    if (!sender) {
      console.debug('WebWorker: sender not initialised. Compressed batch.')
      initiateRestart()
      return
    }
    sender.sendCompressed(data.batch)
  }
  if (data.type === 'uncompressed') {
    if (!sender) {
      console.debug('WebWorker: sender not initialised. Uncompressed batch.')
      initiateRestart()
      return
    }
    sender.sendUncompressed(data.batch)
  }

  if (data.type === 'start') {
    workerStatus = WorkerStatus.Starting
    sender = new QueueSender(
      data.ingestPoint,
      () => {
        // onUnauthorised
        initiateRestart()
      },
      (reason) => {
        // onFailure
        initiateFailure(reason)
      },
      data.connAttemptCount,
      data.connAttemptGap,
      (batch) => {
        postMessage({ type: 'compress', batch }, [batch.buffer])
      },
    )
    writer = new BatchWriter(
      data.pageNo,
      data.timestamp,
      data.url,
      (batch) => sender && sender.push(batch),
      data.tabId,
    )
    if (sendIntervalID === null) {
      sendIntervalID = setInterval(finalize, AUTO_SEND_INTERVAL)
    }
    return (workerStatus = WorkerStatus.Active)
  }

  if (data.type === 'auth') {
    if (!sender) {
      console.debug('WebWorker: sender not initialised. Received auth.')
      initiateRestart()
      return
    }

    if (!writer) {
      console.debug('WebWorker: writer not initialised. Received auth.')
      initiateRestart()
      return
    }

    sender.authorise(data.token)
    data.beaconSizeLimit && writer.setBeaconSizeLimit(data.beaconSizeLimit)
    return
  }
}
