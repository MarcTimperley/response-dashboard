const path = require('path')
const url = require('url')
module.exports = async(req, res, callback = () => { }) => {
  // async (url, callback = () => {  }) => {
  // if(req.url.match(/measurements/gi)) {
  const requestURL = url.parse(req.url)
  // if (req.url.indexOf('?') > -1) req.url = req.url.substring(0, req.url.indexOf('?'))
  // TODO: [] parse string for .js
  console.log(`loading ${path.join(__dirname, requestURL.pathname + '.js')}`)
  // const apiCall = require(__dirname+req.url+'.js')

  try {
    (async() => {
      try {
        const apiCall = await require(path.join(__dirname, requestURL.pathname + '.js'))(requestURL.query)
        // console.log(apiCall)
        res.setHeader('Content-type', 'text/json')
        res.write(JSON.stringify(apiCall))
        res.end()
      } catch (err) {
        // TODO: [] return 404 to user

        console.log(err)
      }
    })()
    callback()
  } catch (err) { console.log(err) }
}
