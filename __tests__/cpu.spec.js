const cpuResponse = require('../lib/api/measurements/cpu')
describe('cpuResponse', () => {
  test('should return number', async() => {
    const response = await cpuResponse()
    expect(response.os1).toBeGreaterThan(0)
    expect(response.os1).toBeLessThan(10)
  })
})
