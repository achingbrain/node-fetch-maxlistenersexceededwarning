import http from 'http'

const PORT = 49823

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write('Hello World!')
  res.end()
}).listen(PORT)

const controller = new AbortController()

for (let i = 0; i < 200; i++) {
  const innerController = new AbortController()

  const abortIt = () => {
    innerController.abort()
  }

  // abort the inner signal when the outer one aborts
  controller.signal.addEventListener('abort', abortIt)

  try {
    // make request
    const res = await fetch(`http://localhost:${PORT}`, {
      signal: innerController.signal
    })

    // drain body
    await res.text()
  } finally {
    // remove the listener we added
    controller.signal.removeEventListener('abort', abortIt)
  }
}
