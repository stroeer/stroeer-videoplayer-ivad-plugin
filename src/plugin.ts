import { version } from '../package.json'
import noop from './noop'
import VASTParser from './VASTParser'
import eventWrapper from './eventWrapper'
import VASTErrorCodesLookup from './VASTErrorCodesLookup'
import Logger from './Logger'

interface IStroeerVideoplayer {
  getUIEl: Function
  getRootEl: Function
  getVideoEl: Function
  getUIName: Function
  setNoContentVideo: Function
  setContentVideo: Function
  initUI: Function
  deinitUI: Function
}

class Plugin {
  public static version: string = version
  public static pluginName: string = 'ivad'
  onVideoElPlay: Function
  onVideoElContentVideoEnded: Function

  constructor () {
    this.onVideoElPlay = noop
    this.onVideoElContentVideoEnded = noop

    return this
  }

  init = (StroeerVideoplayer: IStroeerVideoplayer, opts?: any): void => {
    opts = opts ?? {}
    opts.numRedirects = opts.numRedirects ?? 10
    opts.timeout = opts.timeout ?? 5000
    opts.adLabel = opts.adLabel ?? 'Advertisment ends in {{seconds}} seconds'

    Logger.log('version', Plugin.version)

    const videoEl = StroeerVideoplayer.getVideoEl()
    console.log('videoEl', videoEl)

    this.onVideoElPlay = () => {
      const prerollAdTag = videoEl.getAttribute('data-ivad-preroll-adtag')
      if (prerollAdTag !== null) {
        videoEl.removeEventListener('play', this.onVideoElPlay)
        if (prerollAdTag === 'adblocked') {
          videoEl.dispatchEvent(eventWrapper('IVADerror', {
            errorCode: 301,
            errorMessage: VASTErrorCodesLookup(301)
          }))
          Logger.log('event', 'IVADerror', {
            errorCode: 301,
            errorMessage: VASTErrorCodesLookup(301)
          })
        } else {
          videoEl.pause()
          const vastParser = new VASTParser(StroeerVideoplayer)
          videoEl.dispatchEvent(new CustomEvent('IVADadcall'))
          vastParser.read(prerollAdTag)
        }
      }
    }

    this.onVideoElContentVideoEnded = () => {
      videoEl.addEventListener('play', this.onVideoElPlay)
    }

    videoEl.addEventListener('play', this.onVideoElPlay)
    videoEl.addEventListener('contentVideoEnded', this.onVideoElContentVideoEnded)
  }

  deinit = (StroeerVideoplayer: IStroeerVideoplayer): void => {
    const videoEl = StroeerVideoplayer.getVideoEl()
    videoEl.removeEventListener('play', this.onVideoElPlay)
    videoEl.removeEventListener('contentVideoEnded', this.onVideoElContentVideoEnded)
  }
}

export default Plugin
