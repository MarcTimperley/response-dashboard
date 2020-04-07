const proxy = require('../lib/api/proxy/url')
describe.skip('response', () => {
  test('simple proxy', async() => {
    const url = 'url=http://designs94.com'
    const response = await proxy(url)
    console.log(response)
    expect(response.response).toBeGreaterThan(15)
    expect(response.url).toEqual(url.replace('url=', ''))
  })
  test('simple proxy (no url)', async() => {
    const response = await proxy()
    console.log(response)
    expect(response.response).toBeGreaterThan(15)
    expect(response.url).toEqual('http://www.example.com')
  })
  test('error condition', async() => {
    const url = 'url=http://designs94.comxxx'
    const response = await proxy(url)
    console.log(response)
    expect(response.response.code).toMatch('ENOTFOUND')
  })
})
