import getNodeValue from './getNodeValue'

const getVASTAdTagURI = (xmldoc: XMLDocument): string | boolean => {
  const adTagURIs = xmldoc.getElementsByTagName('VASTAdTagURI')
  if (adTagURIs.length > 0) {
    return getNodeValue(adTagURIs[0])
  } else {
    return false
  }
}

export default getVASTAdTagURI
