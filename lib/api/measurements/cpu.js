const process = require('process')
const os=require('os')
module.exports = () => {
  //  console.log(process.cpuUsage())
  const result = process.cpuUsage()
  result.os1 = os.loadavg()[0]
  result.os5 = os.loadavg()[1]
  result.os15 = os.loadavg()[2]
    return result
}
