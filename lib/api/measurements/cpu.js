/**
 * get the system cpu load averages
 * @module cpu
 */
const process = require('process')
const os = require('os')

/**
 * return os CPU usage
 *
 * @returns {object} result - {os1: cpuUsage load average over 1 minute, os5: cpuUsage load average over 5 minutes, os15: cpuUsage load average over 15 minutes}
 */
module.exports = () => {
  const result = process.cpuUsage()
  result.os1 = os.loadavg()[0]
  result.os5 = os.loadavg()[1]
  result.os15 = os.loadavg()[2]
  return result
}
