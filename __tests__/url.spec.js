const proxy = require('../lib/api/proxy/url')
describe('response', () => {
  test('simple proxy', async() => {
    const url = 'url=http://designs94.com'
    const response = await proxy(url)
    expect(response.response).toBeGreaterThan(15)
    expect(response.url).toEqual(url.replace('url=', ''))
  })
  test('simple proxy (no url)', async() => {
    const response = await proxy()
    expect(response.response).toBeGreaterThan(15)
    expect(response.url).toEqual('http://www.example.com')
  })
  test('error condition', async() => {
    const url = 'url=http://designs94.comxxx'
    const response = await proxy(url)
    expect(response.response.code).toMatch('ENOTFOUND')
  })
})
