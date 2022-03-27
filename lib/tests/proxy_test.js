(async() => {
  const proxyTest = await require('../api/proxy/url')('http://www.google.com')
  console.log(proxyTest)
})()
