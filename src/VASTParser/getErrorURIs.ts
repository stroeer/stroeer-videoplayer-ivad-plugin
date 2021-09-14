import getNodeValue from './getNodeValue'

const getErrorURIs = (xmldoc: XMLDocument): string[] => {
  let i = 0
  let item = null
  const uris: string[] = []
  const list = xmldoc.getElementsByTagName('Error')
  const len = list.length

  for (i = 0; i < len; i++) {
    item = list[i]
    uris.push(getNodeValue(item))
  }

  return uris
}

export default getErrorURIs
