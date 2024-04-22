# fetch/unidici MaxListenersExceededWarning

Using the native `fetch` function from `undici`, if you pass a long-lived abort signal, the `MaxListenersExceededWarning` message appears in the console.

## Repoduction

[index.js](./index.js) starts a HTTP server, creates an `AbortController` and makes repeated requests to the server using the same signal each time.

This is a common pattern where a long-lived signal is present to allow a user to cancel and in-flight requests.

The warning is printed to the console almost immediately:

```console
$ node index.js
(node:37396) MaxListenersExceededWarning: Possible EventTarget memory leak detected. 101 abort listeners added to [AbortSignal]. Use events.setMaxListeners() to increase limit
(Use `node --trace-warnings ...` to show where the warning was created)
(node:37396) MaxListenersExceededWarning: Possible EventTarget memory leak detected. 102 abort listeners added to [AbortSignal]. Use events.setMaxListeners() to increase limit
(node:37396) MaxListenersExceededWarning: Possible EventTarget memory leak detected. 103 abort listeners added to [AbortSignal]. Use events.setMaxListeners() to increase limit
...etc
```

## Workaround

A workaround appears to be to create a new `AbortController` that only exists for the duration of the request, and to invoke it's `abort` method if the `"abort"` event fires on the long-lived signal.

See [workaround.js](./workaround.js) for an implementation.

To avoid introducing another memory leak we remove any added listeners in a `finally` block after resolving the request.

```console
$ node workaround.js
// no output..
```
