/**
 * serve file from local web server
 * @module serveFile
 */
const url = require('url')
const fs = require('fs')
const path = require('path')
/**
 * simple function to serve file
 *
 * @param {object} req - HTTP request
 * @param {object} res - HTTP response
 * @returns null
 */
module.exports = (req, res) => {
  if (!req) return null
  const parsedUrl = url.parse(req.url)
  let pathname = `.${parsedUrl.pathname}`
  const ext = path.parse(pathname).ext
  const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
  }

  if (!fs.existsSync(pathname)) {
    res.statusCode = 404
    res.end(`File ${pathname} not found!`)
    return
  }
  if (fs.statSync(pathname).isDirectory()) pathname += '/index.html' + ext

  fs.readFile(pathname, function(err, data) {
    if (err) {
      res.statusCode = 500
      res.end(`Error getting the file: ${err}.`)
    } else {
      res.setHeader('Content-type', map[ext] || 'text/html')
      res.end(data)
    }
  })
}
