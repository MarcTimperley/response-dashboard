/**
 * url proxy service
 * @module url
 */
const got = require('got')

/**
 * proxy to external url avoiding CORS issues
 * @param {string} url - target url
 * @param {function} [callback = () => {}]
 * @returns {object} result - {url: passed url, response: response time}
 */
module.exports = async(url, callback = () => {}) => {
  try {
    let validURL = false
    if (url && url.match(/url=/gi)) {
      url = url.replace('url=', '')
      validURL = true
    }
    if (!validURL) url = 'http://www.example.com'
    const response = await got(url)
    callback()
    return { url: url, response: response.timings.phases.total }
    //= > '<!doctype html> ...'
  } catch (error) {
    callback()
    return { url: url, response: error }
    //= > 'Internal server error ...'
  }
}
