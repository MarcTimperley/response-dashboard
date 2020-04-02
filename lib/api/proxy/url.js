const http = require('http')
const startTime = new Date()
module.exports = (host) => {

    host = 'http://www.example.com'
    console.log(`connecting to ${host}...`)
    const req = http.request(new URL(host), (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('connect', (connect) => {
            console.log('connected')
            const elapsed = new Date() - startTime
            console.log(elapsed)
           // return { host: host, time: elapsed }
        })

        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // Write data to request body
    
}
