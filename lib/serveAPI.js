/**
 * proxy to async function call
 * @module serveAPI
 */
const path = require('path')
const url = require('url')

/**
 * async function to call local API service
 *
 * @param {object} req - HTTP request
 * @param {object} res - HTTP response
 * @param {*} [callback=() => { }]
 */
module.exports = async(req, res, callback = () => { }) => {
  const requestURL = url.parse(req.url)
  try {
    (async() => {
      try {
        const apiCall = await require(path.join(__dirname, requestURL.pathname + '.js'))(requestURL.query)
        res.setHeader('Content-type', 'text/json')
        res.end(JSON.stringify(apiCall))
      } catch (err) {
        // TODO: [] return 404 file to user
        console.log(err)
        res.statusCode = 404
        res.end(`<h1>Cannot find page ${req.url}</h1>`)
      }
    })()
    callback()
  } catch (err) { console.log(err) }
}
