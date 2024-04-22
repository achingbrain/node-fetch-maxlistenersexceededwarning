import http from 'http'

const PORT = 49823

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write('Hello World!')
  res.end()
}).listen(PORT)

const controller = new AbortController()

for (let i = 0; i < 200; i++) {
  // make request
  const res = await fetch(`http://localhost:${PORT}`, {
    signal: controller.signal
  })

  // drain body
  await res.text()

  // in theory any added event listeners added by undici should/could be removed
  // now as the request has finished so there's nothing left to abort.
}
