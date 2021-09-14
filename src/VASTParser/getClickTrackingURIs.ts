import getNodeValue from './getNodeValue'

const getClickTrackingURIs = (xmldoc: XMLDocument): string[] => {
  let i = 0
  let item = null
  const uris: string[] = []
  const list = xmldoc.getElementsByTagName('ClickTracking')
  const len = list.length

  for (i = 0; i < len; i++) {
    item = list[i]
    uris.push(getNodeValue(item))
  }

  return uris
}

export default getClickTrackingURIs
