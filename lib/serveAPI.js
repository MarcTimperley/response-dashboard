const path = require('path')
const url = require('url')
module.exports = async(req, res, callback = () => { }) => {
  const requestURL = url.parse(req.url)
  // console.log(`loading ${path.join(__dirname, requestURL.pathname + '.js')}`)
  // const apiCall = require(__dirname+req.url+'.js')
  try {
    (async() => {
      try {
        const apiCall = await require(path.join(__dirname, requestURL.pathname + '.js'))(requestURL.query)
        // console.log(apiCall)
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
