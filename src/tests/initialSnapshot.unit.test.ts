import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals'
import App from '../main/app/index.js'
import { Type } from '../common/messages.gen.js'
import { ToWorkerData } from '../common/interaction.js'

const workerMessages: ToWorkerData[] = []

class RecordingWorker {
  postMessage(message: ToWorkerData) {
    // A real worker receives a copy, even when the caller reuses its message buffer.
    workerMessages.push(JSON.parse(JSON.stringify(message)))
  }
}

describe('initial snapshot delivery', () => {
  let app: App

  beforeEach(() => {
    jest.useFakeTimers()
    workerMessages.length = 0
    sessionStorage.clear()
    localStorage.clear()
    document.body.innerHTML = '<main><p>First node</p><p>Last node</p></main>'
    global.Worker = RecordingWorker as unknown as typeof Worker
    URL.createObjectURL = jest.fn(() => 'blob:synthetic-worker')
    global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
      status: 200,
      json: async () => ({
        token: 'synthetic-token',
        userUUID: 'synthetic-user',
        sessionID: 'synthetic-session',
        projectID: 'synthetic-project',
        delay: 0,
        compressionThreshold: 20000,
      }),
    } as Response)
    app = new App('synthetic-project', undefined, { forceSingleTab: true })
  })

  afterEach(() => {
    app.stop()
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  async function start() {
    const started = app.start()
    jest.advanceTimersByTime(25)
    return started
  }

  function expectCompleteSnapshotBeforeFinalize() {
    const finalizationIndex = workerMessages.lastIndexOf(null)
    expect(finalizationIndex).toBeGreaterThan(0)
    const snapshot = workerMessages[finalizationIndex - 1]
    expect(Array.isArray(snapshot)).toBe(true)
    expect(snapshot).toEqual(
      expect.arrayContaining([
        [Type.CreateDocument],
        expect.arrayContaining([Type.SetNodeData, expect.any(Number), 'Last node']),
      ]),
    )
    expect(workerMessages.slice(0, finalizationIndex)).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'auth', token: 'synthetic-token' })]),
    )
  }

  test('commits the complete initial document before requesting an immediate upload', async () => {
    expect((await start()).success).toBe(true)
    // Neither the 30 ms commit ticker nor the worker's 10 s upload timer has fired.
    expectCompleteSnapshotBeforeFinalize()
    expect(workerMessages.filter((message) => message === null)).toHaveLength(1)
    expect(workerMessages).not.toContain('forceFlushBatch')
  })

  test('uploads the fresh snapshot when the tracker is restarted', async () => {
    await start()
    app.stop()
    workerMessages.length = 0
    expect((await start()).success).toBe(true)
    expectCompleteSnapshotBeforeFinalize()
    expect(workerMessages.filter((message) => message === null)).toHaveLength(1)
  })

  test('does not upload a snapshot when startup is rejected', async () => {
    jest.mocked(global.fetch).mockResolvedValue({
      status: 403,
      text: async () => 'Rejected synthetic project',
    } as Response)
    expect((await start()).success).toBe(false)
    expect(workerMessages).not.toContain(null)
    expect(workerMessages.some(Array.isArray)).toBe(false)
  })
})
