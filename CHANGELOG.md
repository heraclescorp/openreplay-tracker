# 9.0.11

- new `resetTabOnWindowOpen` option to fix window.open issue with sessionStorage being inherited (replicating tabId bug), users still should use 'noopener=true' in window.open to prevent it in general...
- do not create BC channel in iframe context, add regeneration of tabid incase of duplication

# 9.0.10

- added `excludedResourceUrls` to timings options to better sanitize network data

# 9.0.9

- Fix for `{disableStringDict: true}` behavior

# 9.0.8

- added slight delay to iframe handler (rapid updates of stacked frames used to break player)

# 9.0.7

- fix for `getSessionURL` method

# 9.0.6

- added `tokenUrlMatcher` option to network settings, allowing to ingest session token header to custom allowed urls

# 9.0.5

- same fixes but for fetch proxy

# 9.0.2 & 9.0.3 & 9.0.4

- fixes for "setSessionTokenHeader" method

# 9.0.1

- Warning about SSR mode
- Prevent crashes due to network proxy in SSR

# 9.0.0

- Option to disable string dictionary `{disableStringDict: true}` in Tracker constructor
- Introduced Feature flags api
- Fixed input durations recorded on programmable autofill
- change InputMode from enum to const Object

# 8.1.2

- option to disable string dictionary `{disableStringDict: true}` in Tracker constructor

# 8.1.1

[collective patch]

- Console and network are now using proxy objects to capture calls (opt in for network), use ` { network: { useProxy: true } }` to enable it
- Force disable Multitab feature for old browsers (2016 and older + safari 14)

# 8.0.0

- **[breaking]** support for multi-tab sessions

# 7.0.4

- option to disable string dictionary `{disableStringDict: true}` in Tracker constructor

# 7.0.3

- Prevent auto restart after manual stop

# 7.0.2

- fixed header sanitization for axios causing empty string in some cases

# 7.0.1

- fix time inputs capturing
- add option `{ network: { captureInIframes: boolean } }` to disable network tracking inside iframes (default true)
- added option `{ network: { axiosInstances: AxiosInstance[] } }` to include custom axios instances for better tracking

# 7.0.0

- **[breaking]** added gzip compression to large messages
- fix email regexp to significantly improve performance

# 6.0.2

- fix network tracking for same domain iframes created by js code

# 6.0.1

- fix webworker writer re-init request
- remove useless logs
- tune mouse thrashing detection
- fix iframe handling
- optimise node counting for dom drop

# 6.0.0

**(Compatible with OpenReplay v1.11.0+ only)**

- **[breaking]:** Capture mouse thrashing, input hesitation+duration, click hesitation
- Capture DOM node drop event (>30% nodes removed)
- Capture iframe network requests
- Detect cached requests to img, css and js resources; send transferred size
- added `{ mouse: { disableClickmaps: boolean } }` to disable calculating el. selectors
- added `{ mouse: { minSelectorDepth?: number; nthThreshold?: number; maxOptimiseTries?: number }` for selector finding optimizations

## 5.0.2

- fixed inline css loading in specific cases when assets gets around min flush size

## 5.0.1

- Re-init worker after device sleep/hybernation
- Default text input mode is now Obscured
- Use `@medv/finder` instead of our own implementation of `getSelector` for better clickmaps experience

## 5.0.0

**(Compatible with OpenReplay v1.10.0+ only)**

- **[breaking]:** string dictionary to reduce session size
- Added "tel" to supported input types
- Added `{ withCurrentTime: true }` to `tracker.getSessionURL` method which will return sessionURL with current session's timestamp
- Added Network module that captures fetch/xhr by default (with no plugin required)
- Use `timeOrigin()` instead of `performance.timing.navigationStart` in ResourceTiming messages
- Added app restart when service worker died after inactivity (mobile safari)

## 4.1.8

- recalculate timeOrigin on start to prevent wrong timestamps on "sleeping" sessions

## 4.1.7

- resend metadata on start

## 4.1.6

- remove log that potentially caused crashed during slow initial render
