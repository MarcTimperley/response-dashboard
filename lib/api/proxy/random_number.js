/**
 * get random number via API to external service
 * @module random_number
 */
const got = require('got')

/*
Example configuration:
{
    "name": "random number (API)",
    "location": "board4",
    "url": "../api/proxy/random_number?url=https://csrng.net/csrng/csrng.php?min=0&max=100",
    "max": 100,
    "value": "random",
    "chartType": "spark",
    "data": []
  }
  */

/**
 * async function to get random number
 *
 * @param {string} url - target url
 * @param {function} [callback=() => {}]
 * @returns {object} result - {url: passed url, random: random number}
 */
module.exports = async(url, callback = () => { }) => {
  try {
    if (url && url.match(/url=/gi)) {
      url = url.replace('url=', '')
    }
    const response = await got(url, {
      responseType: 'json'
    })
    callback()
    // change to get the JSON response you want to measure
    return { url: url, random: response.body[0].random }
  } catch (error) {
    callback()
    return { url: url, response: error }
  }
}
