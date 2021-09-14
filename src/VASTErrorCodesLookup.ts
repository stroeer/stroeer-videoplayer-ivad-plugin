interface IVASTErrorCodes {
  100: string
  101: string
  102: string
  200: string
  201: string
  202: string
  203: string
  204: string
  205: string
  206: string
  300: string
  301: string
  302: string
  303: string
  304: string
  400: string
  401: string
  402: string
  403: string
  405: string
  900: string
  901: string
  902: string
}

const VASTErrorCodes = {
  100: 'XML Parsing Error.',
  101: 'VAST schema validation error.',
  102: 'VAST version of response not supported.',
  200: 'Trafficking error. Media player received an Ad type that it was not expecting and/or cannot play.',
  201: 'Media player expecting different linearity.',
  202: 'Media player expecting different duration.',
  203: 'Media player expecting different size.',
  204: 'Ad category was required but not provided.',
  205: 'Inline Category violates Wrapper BlockedAdCagetories (refer 3.19.2).',
  206: 'Ad Break shortened. Ad was not served.',
  300: 'General Wrapper error.',
  301: 'Timeout of VAST URI provied in Wrapper element, or of VAST URI provied in a subsequent Wrapper element. (URI was either unavailable or reached a timeout as defined by the media player.)',
  302: 'Wrapper limit reached, as defined by the media player. Too many Wrapper responses have been received with no InLine response.',
  303: 'No VAST response after one or more Wrappers.',
  304: 'InLine response returned ad unit that failed to result in ad display withing defined time limit.',
  400: 'General Linear error. Media player is unable to display the Linear Ad.',
  401: 'File not found. Unable to find Linear/MedaFile from URI.',
  402: 'Timeout of MediaFile URI.',
  403: "Could't find MediaFile that is supported by this media player, based on the attributes of the MediaFile element.",
  405: "Problem displaying MediaFile. Media player found a MediaFile with supported type but couldn't display it. MediaFile may include: unsupported codecs, different MIME type than MediaFile@type, unsupported delivery method, etc.",
  900: 'Undefined Error.',
  901: 'General VPAID error.',
  902: 'General InteractiveCreativeFile error code'
}

const VASTErrorCodesLookup = (errorCode: number): string => {
  const err = VASTErrorCodes[errorCode as keyof IVASTErrorCodes]
  if (err !== undefined) {
    return err
  } else {
    return ''
  }
}

export default VASTErrorCodesLookup
