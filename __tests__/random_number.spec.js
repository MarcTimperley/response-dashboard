const fn = require('../lib/api/proxy/random_number')
describe('response', () => {
  test('should return number', async() => {
    const url = 'https://csrng.net/csrng/csrng.php?min=0&max=100'
    const response = await fn(url)
    console.log(response)
    expect(response.random).toBeGreaterThan(0)
    expect(response.random).toBeLessThan(100)
  })
})
describe('response', () => {
  test('should return number - long url', async() => {
    const url = 'url=https://csrng.net/csrng/csrng.php?min=0&max=100'
    const response = await fn(url)
    console.log(response)
    expect(response.random).toBeGreaterThan(0)
    expect(response.random).toBeLessThan(100)
  })
})
describe('response', () => {
  test('should return error - HTTPError', async() => {
    const url = 'url=https://csrng.net/csrng/csrng.ph'
    const response = await fn(url)
    expect(response.response.name).toBe('HTTPError')
  })
})
