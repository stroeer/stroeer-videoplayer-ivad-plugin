import getNodeValue from './getNodeValue'

const getTrackingByTypeURIs = (xmldoc: XMLDocument, type: string): string[] => {
  let i = 0
  let item = null
  const uris: string[] = []
  const list = xmldoc.getElementsByTagName('Tracking')
  const len = list.length

  for (i = 0; i < len; i++) {
    item = list[i]
    if (item.getAttribute('event') !== type) continue
    uris.push(getNodeValue(item))
  }

  return uris
}

export default getTrackingByTypeURIs
