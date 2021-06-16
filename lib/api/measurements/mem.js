/**
 * get the system memory consumption
 * @module mem
*/
const process = require('process')
const os = require('os')

/**
   * get memory stats from the system
   *
   * @returns {object} result - {osUsed: % of total memory consumed, freemem: free memory (string), totalmem: total memory (string)}
   */
module.exports = () => {
  const mem = process.memoryUsage()
  const result = { used: Math.floor(100 * mem.heapUsed / mem.heapTotal) }
  const used = os.totalmem() - os.freemem()
  result.osUsed = Math.floor(100 * used / os.totalmem())
  result.freemem = os.freemem().toLocaleString()
  result.totalmem = os.totalmem().toLocaleString()
  return result
}
