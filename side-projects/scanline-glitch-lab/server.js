const http = require("http")
const fs = require("fs")
const path = require("path")

const PORT = process.env.PORT || 4173
const ROOT = __dirname

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
}

const server = http.createServer((req, res) => {
  const requestPath = req.url === "/" ? "/index.html" : req.url
  const unsafePath = decodeURIComponent(requestPath.split("?")[0])
  const filePath = path.join(ROOT, unsafePath)

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403)
    res.end("Forbidden")
    return
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
        res.end("Not found")
        return
      }

      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" })
      res.end("Internal server error")
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME[ext] || "application/octet-stream"

    res.writeHead(200, { "Content-Type": contentType })
    res.end(data)
  })
})

server.listen(PORT, () => {
  console.log(`Scanline Glitch Lab running at http://localhost:${PORT}`)
})
