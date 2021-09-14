import replaceMacros from './replaceMacros'
import VASTErrorCodesLookup from './../VASTErrorCodesLookup'
import Logger from './../Logger'

const getMacroRegex = (macro: string): RegExp => {
  const re = new RegExp('((\\[|%%|__|%5B)' + macro + '(\\]|%%|__|%5D))', 'g')
  return re
}

const createErrorTrackingPixel = (uri: string, errorCode: number): void => {
  const errorText = VASTErrorCodesLookup(errorCode)
  if (errorText === '') {
    Logger.log('errorcode', errorCode, 'undefined')
    return
  }
  const url = replaceMacros(uri)
    .replace(getMacroRegex('ERRORCODE'), errorCode.toString())
    .replace(getMacroRegex('ERROR'), errorText)
  const img = document.createElement('img')
  const cleanupCallback = (): void => {
    if (img.parentNode !== null) img.parentNode.removeChild(img)
  }
  img.onload = () => {
    cleanupCallback()
  }
  img.onerror = () => {
    cleanupCallback()
  }
  img.style.width = '1px'
  img.style.height = '1px'
  img.style.top = '-1'
  img.style.left = '-1'
  img.style.position = 'absolute'
  img.src = url
  document.body.appendChild(img)
}

export default createErrorTrackingPixel
