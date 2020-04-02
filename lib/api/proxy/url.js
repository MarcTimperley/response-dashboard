const got = require('got')
module.exports = async(url, callback = () => { }) => {
  try {
    let validURL = false
    // console.log(url)
    if (url && url.match(/url=/gi)) {
      url = url.replace('url=', '')
      validURL = true
    }
    if (!validURL) url = 'http://www.example.com'
    const response = await got(url)
    // console.log(response.body);

    callback()
    return {url: url, response: response.timings.phases.total}
    //= > '<!doctype html> ...'
  } catch (error) {
    return {url: url, response: error}
    //= > 'Internal server error ...'
  }
}
