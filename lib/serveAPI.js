module.exports = (req, res) => {
    // if(req.url.match(/measurements/gi)) {
    if (req.url.indexOf('?') > -1) req.url = req.url.substring(0, req.url.indexOf('?'))
    console.log('loading ' + __dirname + req.url + '.js')
        const apiCall = require(__dirname+req.url+'.js')


       /* (async () => {
            const apiCall = await require(__dirname + req.url + '.js')()
            console.log(apiCall)
        })()
        */
    res.setHeader('Content-type', 'text/json')
    res.write(JSON.stringify(apiCall()))
    res.end()
    // }
}