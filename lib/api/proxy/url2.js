module.exports = () => {
    const http = require('http')
    const https = require('https')
    const startDate = new Date()
    const url = 'http://www.example.com'
    const parsed = new URL(url)
    let result = {}
    result.url = parsed
    result.hostname = parsed.hostname
    // console.log(new URL(url))
    const options = {
        hostname: parsed.hostname,
        headers: {
            'User-Agent': 'Example'
        }
    };

    const req = (parsed.protocol === 'https' ? https : http).request(options, (res) => {
        // console.log(`STATUS: ${res.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            // console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
            result.elapsed = new Date() - startDate
            // console.log(result)
            return { elapsed: result.elapsed }
        });

    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // Write data to request body
    // req.write(postData);
    req.end();
    //console.log(result)
    //return result
}