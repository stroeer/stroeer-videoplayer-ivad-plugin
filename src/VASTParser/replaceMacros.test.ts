import replaceMacros from './replaceMacros'
import getUnixtimestamp from './../getUnixtimestamp'

it('should replace [CACHEBUSTER] with a random number', () => {
  let uri = '[CACHEBUSTER]'
  uri = replaceMacros(uri)
  const asNumber = parseInt(uri, 10)
  expect(uri.indexOf('[CACHEBUSTER]')).toBe(-1)
  expect(asNumber).toBeGreaterThanOrEqual(0)
  expect(asNumber).toBeLessThan(9007199254740992)
})

it('should replace [TIMESTAMP] with the current unix timestamp', () => {
  const uri = '[TIMESTAMP]'
  const unixTimestampStr = getUnixtimestamp().toString()
  expect(replaceMacros(uri)).toBe(unixTimestampStr)
})

it('should replace [REFERRER_URL] with the current page url', () => {
  let uri = '[REFERRER_URL]'
  uri = replaceMacros(uri)
  expect(uri.indexOf('[REFERRER_URL]')).toBe(-1)
  expect(uri).toBe(window.location.href)
})
