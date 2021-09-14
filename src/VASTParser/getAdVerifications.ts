const getAdVerifications = (xmldoc: XMLDocument): any[] => {
  let i = 0
  let item = null
  const collectedNodes: any[] = []
  const list = xmldoc.querySelectorAll('AdVerifications Verification')
  const len = list.length

  for (i = 0; i < len; i++) {
    item = list[i]
    collectedNodes.push(item)
  }

  return collectedNodes
}

export default getAdVerifications
