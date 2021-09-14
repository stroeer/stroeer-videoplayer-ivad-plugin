const getNodeValue = (node: Node | undefined): string => {
  if (node === undefined) return ''
  const val = node.nodeValue ?? node.textContent
  if (val !== null) {
    return val.toString().trim()
  } else {
    return ''
  }
}

export default getNodeValue
