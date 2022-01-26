let debugMode = false
if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
  if (window.localStorage.getItem('StroeerVideoplayerDebugMode') !== null) {
    debugMode = true
  }
}
const Logger = {
  log: function (...args: any[]) {
    if (debugMode) {
      args.unshift('stroeer-videoplayer-ivad-plugin')
      console.log.apply(console, args)
    }
  }
}

export default Logger
