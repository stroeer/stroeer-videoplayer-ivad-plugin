function basicBrowserSniffer () {
  if (navigator.userAgent.match(/edge\//i)) {
    return 'edge/edgehtml'
  }
  if (navigator.userAgent.match(/edg\//i)) {
    return 'edge/edgehtml'
  } else if (navigator.vendor.match(/google/i)) {
    return 'chrome/blink'
  } else if (navigator.vendor.match(/apple/i)) {
    return 'safari/webkit'
  } else if (navigator.userAgent.match(/firefox\//i)) {
    return 'firefox/gecko'
  } else if (navigator.userAgent.match(/trident\//i)) {
    return 'ie/trident'
  } else if (navigator.userAgent.match(/msie\//i)) {
    return 'ie/trident'
  } else {
    return navigator.userAgent + ':::' + navigator.vendor
  }
}

export default basicBrowserSniffer
