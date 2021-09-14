import getUnixtimestamp from './../getUnixtimestamp'
import getRandomNumber from './../getRandomNumber'

const doesRegexMatchURI = (re: RegExp, uri: string): boolean => {
  if (re.test(uri)) {
    return true
  } else {
    return false
  }
}

const getMacroRegex = (macro: string): RegExp => {
  const re = new RegExp('((\\[|%%|__|%5B)' + macro + '(\\]|%%|__|%5D))', 'g')
  return re
}

const replaceMacros = (uri: string): string => {
  let re

  re = getMacroRegex('CACHEBUSTER')
  if (doesRegexMatchURI(re, uri)) {
    uri = uri.replace(re, getRandomNumber(0, 9007199254740991).toString())
  }

  re = getMacroRegex('TIMESTAMP')
  if (doesRegexMatchURI(re, uri)) {
    uri = uri.replace(re, getUnixtimestamp().toString())
  }

  re = getMacroRegex('REFERRER_URL')
  if (doesRegexMatchURI(re, uri)) {
    uri = uri.replace(re, window.location.href)
  }

  re = getMacroRegex('OMIDPARTNER')
  if (doesRegexMatchURI(re, uri)) {
    uri = uri.replace(re, 'stroeer')
  }

  return uri
}

export default replaceMacros
