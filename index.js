const http = require('http');
const port = process.argv[2] || 4000;
const serveFile = require('./lib/serveFile.js')
const serveAPI = require('./lib/serveAPI2.js')

http.createServer(function (req, res) {
    if (req.url.match(/api/gi)) {
        serveAPI(req, res)
    }
    else {
        serveFile(req, res)
    }
}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);


