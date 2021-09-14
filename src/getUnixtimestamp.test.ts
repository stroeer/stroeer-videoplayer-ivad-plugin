import getUnixtimestamp from './getUnixtimestamp'

const _getUnixtimestamp = (): number => {
  return Math.floor(Date.now() / 1000)
}

it('should output the current unix timestamp', () => {
  const ts1 = getUnixtimestamp()
  const ts2 = _getUnixtimestamp()
  expect(ts1).toBe(ts2)
})
