import replaceMacros from './replaceMacros'

const createTrackingPixel = (uri: string): void => {
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
  img.src = replaceMacros(uri)
  document.body.appendChild(img)
}

export default createTrackingPixel
