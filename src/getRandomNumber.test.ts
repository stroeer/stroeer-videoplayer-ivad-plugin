import getRandomNumber from './getRandomNumber'

it('should output a random number between 1 and 2', () => {
  const num = getRandomNumber(1, 2)
  expect(num).toBeGreaterThanOrEqual(1)
  expect(num).toBeLessThan(3)
})
