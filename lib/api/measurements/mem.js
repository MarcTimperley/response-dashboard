const process = require('process')
const os = require ('os')
module.exports = () => {
    //  console.log(process.cpuUsage())
    const mem = process.memoryUsage()
    let result = {used: Math.floor(100 * mem.heapUsed / mem.heapTotal)}
    const used = os.totalmem()-os.freemem()
    result.osUsed = Math.floor(100*used/os.totalmem())
    result.freemem=os.freemem().toLocaleString()
    result.totalmem=os.totalmem().toLocaleString()
    return result
}
