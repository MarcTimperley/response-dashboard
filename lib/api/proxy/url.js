const got = require('got')
module.exports = async(url, callback = () => { }) => {
  try {
    let validURL = false
    if (url && url.match(/url=/gi)) {
      url = url.replace('url=', '')
      validURL = true
    }
    if (!validURL) url = 'http://www.example.com'
    const response = await got(url)
    callback()
    return {url: url, response: response.timings.phases.total}
    //= > '<!doctype html> ...'
  } catch (error) {
    callback()
    return {url: url, response: error}
    //= > 'Internal server error ...'
  }
}
