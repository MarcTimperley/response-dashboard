//const url = require('../api/proxy/url')
//const url2 = require('../api/proxy/url2')
(async ()=> {
   const url3 = await require('../api/proxy/url3')('http://www.google.com')
   console.log(url3)
})()
//url()
