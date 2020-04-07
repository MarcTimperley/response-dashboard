const memResponse = require('../lib/api/measurements/mem')
describe('memResponse', () => {
  test('should return number', async() => {
    const response = await memResponse()
    expect(response.used).toBeGreaterThan(0)
    expect(response.used).toBeLessThan(100)
  })
})
