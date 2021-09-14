import { fetch } from 'whatwg-fetch'
import noop from './noop'
import Logger from './Logger'
import UUID from './UUID'
import OMIDUtils from './OMIDUtils'
import VPAIDUtils from './VPAIDUtils'
import getNodeValue from './VASTParser/getNodeValue'
import getMediaFileClosestTo from './VASTParser/getMediaFileClosestTo'
import createTrackingPixel from './VASTParser/createTrackingPixel'
import createErrorTrackingPixel from './VASTParser/createErrorTrackingPixel'
import getClickTrackingURIs from './VASTParser/getClickTrackingURIs'
import getAdVerifications from './VASTParser/getAdVerifications'
import getErrorURIs from './VASTParser/getErrorURIs'
import getImpressionURIs from './VASTParser/getImpressionURIs'
import getVASTAdTagURI from './VASTParser/getVASTAdTagURI'
import getTrackingByTypeURIs from './VASTParser/getTrackingByTypeURIs'
import replaceMacros from './VASTParser/replaceMacros'
import eventWrapper from './eventWrapper'
import VASTErrorCodesLookup from './VASTErrorCodesLookup'

class VASTParser {
  _StroeerVideoplayer: any
  _VASTAdTagURIChain: string[]
  _VASTDocuments: XMLDocument[]
  _trackingStartURIsFired: boolean
  _trackingFirstQuartileURIsFired: boolean
  _trackingMidpointURIsFired: boolean
  _trackingThirdQuartileURIsFired: boolean
  _trackingCreativeViewURIsFired: boolean
  _impressionURIsFired: boolean
  _isInFullscreenMode: boolean
  _isMuted: boolean
  _onPlayCallback: EventListenerOrEventListenerObject
  _onPauseCallback: EventListenerOrEventListenerObject
  _onMuteCallback: EventListenerOrEventListenerObject
  _onUnmuteCallback: EventListenerOrEventListenerObject
  _onResumeCallback: EventListenerOrEventListenerObject
  _onEndedCallback: EventListenerOrEventListenerObject
  _onTimeupdateCallback: EventListenerOrEventListenerObject
  _onFullscreenchangeCallback: EventListenerOrEventListenerObject
  _onClickThroughCallback: EventListenerOrEventListenerObject
  _originalVideoSource: string
  _originalUIName: string
  adSessionID: string
  adVerifications: any[]
  clickTrackingURIs: string[]
  errorURIs: string[]
  impressionURIs: string[]
  trackingCollapseURIs: string[]
  trackingCompleteURIs: string[]
  trackingCreativeViewURIs: string[]
  trackingExitFullscreenURIs: string[]
  trackingExpandURIs: string[]
  trackingFirstQuartileURIs: string[]
  trackingFullscreenURIs: string[]
  trackingMidpointURIs: string[]
  trackingMuteURIs: string[]
  trackingPauseURIs: string[]
  trackingResumeURIs: string[]
  trackingStartURIs: string[]
  trackingThirdQuartileURIs: string[]
  trackingUnmuteURIs: string[]
  videoEl: HTMLVideoElement

  constructor (StroeerVideoplayer: any) {
    this._trackingCreativeViewURIsFired = false
    this._trackingStartURIsFired = false
    this._trackingFirstQuartileURIsFired = false
    this._trackingMidpointURIsFired = false
    this._trackingThirdQuartileURIsFired = false
    this._impressionURIsFired = false
    this._isInFullscreenMode = false
    this._isMuted = StroeerVideoplayer.getVideoEl().muted
    this._onPlayCallback = noop
    this._onPauseCallback = noop
    this._onMuteCallback = noop
    this._onUnmuteCallback = noop
    this._onResumeCallback = noop
    this._onEndedCallback = noop
    this._onTimeupdateCallback = noop
    this._onFullscreenchangeCallback = noop
    this._onClickThroughCallback = noop
    this._StroeerVideoplayer = StroeerVideoplayer
    this._VASTAdTagURIChain = []
    this._VASTDocuments = []
    this.adSessionID = UUID()
    this.adVerifications = []
    this.clickTrackingURIs = []
    this.errorURIs = []
    this.impressionURIs = []
    this.trackingCollapseURIs = []
    this.trackingCompleteURIs = []
    this.trackingCreativeViewURIs = []
    this.trackingExitFullscreenURIs = []
    this.trackingExpandURIs = []
    this.trackingFirstQuartileURIs = []
    this.trackingFullscreenURIs = []
    this.trackingMidpointURIs = []
    this.trackingMuteURIs = []
    this.trackingPauseURIs = []
    this.trackingResumeURIs = []
    this.trackingStartURIs = []
    this.trackingThirdQuartileURIs = []
    this.trackingUnmuteURIs = []
    this.videoEl = StroeerVideoplayer.getVideoEl()
    const playerHls = StroeerVideoplayer.getHls()
    if (playerHls !== null) {
      this._originalVideoSource = playerHls.url
    } else {
      // workaround for ie11 and all the browsers that do not support currentSrc
      // @ts-expect-error
      this._originalVideoSource = this.videoEl.currentSrc ?? this.videoEl.querySelector('source').src
    }
    this._originalUIName = StroeerVideoplayer.getUIName()
    return this
  }

  reset (): void {
    this._impressionURIsFired = false
    this._trackingStartURIsFired = false
    this._trackingFirstQuartileURIsFired = false
    this._trackingMidpointURIsFired = false
    this._trackingThirdQuartileURIsFired = false
    this._trackingCreativeViewURIsFired = false
    this._VASTAdTagURIChain = []
    this._VASTDocuments = []
    this.clickTrackingURIs = []
    this.errorURIs = []
    this.impressionURIs = []
    this.trackingCollapseURIs = []
    this.trackingCompleteURIs = []
    this.trackingCreativeViewURIs = []
    this.trackingExitFullscreenURIs = []
    this.trackingExpandURIs = []
    this.trackingFirstQuartileURIs = []
    this.trackingFullscreenURIs = []
    this.trackingMidpointURIs = []
    this.trackingMuteURIs = []
    this.trackingPauseURIs = []
    this.trackingResumeURIs = []
    this.trackingStartURIs = []
    this.trackingThirdQuartileURIs = []
    this.trackingUnmuteURIs = []
    this._removeEventHandlers()
  }

  _addEventHandlers (): void {
    this._onTimeupdateCallback = (): void => {
      const video = this.videoEl
      const duration = video.duration
      const currentTime = video.currentTime
      if ((currentTime >= duration / 4) && !this._trackingFirstQuartileURIsFired) {
        this._trackingFirstQuartileURIsFired = true
        this.trackingFirstQuartileURIs.forEach((uri: string) => {
          createTrackingPixel(uri)
        })
        video.dispatchEvent(eventWrapper('IVADfirstQuartile'))
      }
      if ((currentTime >= duration / 2) && !this._trackingMidpointURIsFired) {
        this._trackingMidpointURIsFired = true
        this.trackingMidpointURIs.forEach((uri: string) => {
          createTrackingPixel(uri)
        })
        video.dispatchEvent(eventWrapper('IVADmidpoint'))
      }
      if ((currentTime >= duration / 4 * 3) && !this._trackingThirdQuartileURIsFired) {
        this._trackingThirdQuartileURIsFired = true
        this.trackingThirdQuartileURIs.forEach((uri: string) => {
          createTrackingPixel(uri)
        })
        video.dispatchEvent(eventWrapper('IVADthirdQuartile'))
      }
    }

    this._onPlayCallback = (): void => {
      if (!this._impressionURIsFired) {
        this._impressionURIsFired = true
        this.impressionURIs.forEach((uri: string) => {
          createTrackingPixel(uri)
        })
        this.videoEl.dispatchEvent(eventWrapper('IVADimpression'))
      }
      if (!this._trackingStartURIsFired) {
        this._trackingStartURIsFired = true
        this.trackingStartURIs.forEach((uri: string) => {
          createTrackingPixel(uri)
        })
        this.videoEl.dispatchEvent(eventWrapper('IVADtrackingStart'))
      }
      if (!this._trackingCreativeViewURIsFired) {
        this._trackingCreativeViewURIsFired = true
        this.trackingCreativeViewURIs.forEach((uri: string) => {
          createTrackingPixel(uri)
        })
        this.videoEl.dispatchEvent(eventWrapper('IVADtrackingCreativeView'))
      }
    }

    this._onPauseCallback = (): void => {
      this.trackingPauseURIs.forEach((uri: string) => {
        createTrackingPixel(uri)
      })
      this.videoEl.dispatchEvent(eventWrapper('IVADpause'))
    }

    this._onMuteCallback = (): void => {
      if (this.videoEl.muted && !this._isMuted) {
        this._isMuted = true
        this.trackingMuteURIs.forEach((uri: string) => {
          createTrackingPixel(uri)
        })
        this.videoEl.dispatchEvent(eventWrapper('IVADmute'))
      }
    }

    this._onUnmuteCallback = (): void => {
      if (!this.videoEl.muted && this._isMuted) {
        this._isMuted = false
        this.trackingUnmuteURIs.forEach((uri: string) => {
          createTrackingPixel(uri)
        })
        this.videoEl.dispatchEvent(eventWrapper('IVADunmute'))
      }
    }

    this._onResumeCallback = (): void => {
      if (this.videoEl.currentTime > 0) {
        this.trackingResumeURIs.forEach((uri: string) => {
          createTrackingPixel(uri)
        })
        this.videoEl.dispatchEvent(eventWrapper('IVADresume'))
      }
    }

    this._onFullscreenchangeCallback = (): void => {
      if (document.fullscreenElement === this.videoEl || document.fullscreenElement === this._StroeerVideoplayer.getRootEl()) {
        this._isInFullscreenMode = true
        this.trackingFullscreenURIs.forEach((uri: string) => {
          createTrackingPixel(uri)
        })
        this.videoEl.dispatchEvent(eventWrapper('IVADfullscreen'))
      } else {
        if (this._isInFullscreenMode) {
          this._isInFullscreenMode = false
          this.trackingExitFullscreenURIs.forEach((uri: string) => {
            createTrackingPixel(uri)
          })
          this.videoEl.dispatchEvent(eventWrapper('IVADexitFullscreen'))
        }
      }
    }

    this._onEndedCallback = (): void => {
      this.trackingCompleteURIs.forEach((uri: string) => {
        createTrackingPixel(uri)
      })
      this.videoEl.dispatchEvent(eventWrapper('IVADended'))

      this.reset()
    }

    this.videoEl.addEventListener('play', this._onPlayCallback)
    this.videoEl.addEventListener('pause', this._onPauseCallback)
    this.videoEl.addEventListener('volumechange', this._onMuteCallback)
    this.videoEl.addEventListener('volumechange', this._onUnmuteCallback)
    this.videoEl.addEventListener('play', this._onResumeCallback)
    this.videoEl.addEventListener('ended', this._onEndedCallback)
    this.videoEl.addEventListener('timeupdate', this._onTimeupdateCallback)
    document.addEventListener('fullscreenchange', this._onFullscreenchangeCallback)
  }

  _removeEventHandlers (): void {
    this.videoEl.removeEventListener('play', this._onPlayCallback)
    this.videoEl.removeEventListener('pause', this._onPauseCallback)
    this.videoEl.removeEventListener('volumechange', this._onMuteCallback)
    this.videoEl.removeEventListener('volumechange', this._onUnmuteCallback)
    this.videoEl.removeEventListener('play', this._onResumeCallback)
    this.videoEl.removeEventListener('ended', this._onEndedCallback)
    this.videoEl.removeEventListener('timeupdate', this._onTimeupdateCallback)
    document.removeEventListener('fullscreenchange', this._onFullscreenchangeCallback)
    this._StroeerVideoplayer.getRootEl().removeEventListener('click', this._onClickThroughCallback)
  }

  parse (xmldoc: XMLDocument): void {
    getErrorURIs(xmldoc)
      .forEach((item: string) => { this.errorURIs.push(item) })
    getImpressionURIs(xmldoc)
      .forEach((item: string) => { this.impressionURIs.push(item) })
    getClickTrackingURIs(xmldoc)
      .forEach((item: string) => { this.clickTrackingURIs.push(item) })
    getTrackingByTypeURIs(xmldoc, 'creativeView')
      .forEach((item: string) => { this.trackingCreativeViewURIs.push(item) })
    getTrackingByTypeURIs(xmldoc, 'start')
      .forEach((item: string) => { this.trackingStartURIs.push(item) })
    getTrackingByTypeURIs(xmldoc, 'complete')
      .forEach((item: string) => { this.trackingCompleteURIs.push(item) })
    getTrackingByTypeURIs(xmldoc, 'firstQuartile')
      .forEach((item: string) => { this.trackingFirstQuartileURIs.push(item) })
    getTrackingByTypeURIs(xmldoc, 'midpoint')
      .forEach((item: string) => { this.trackingMidpointURIs.push(item) })
    getTrackingByTypeURIs(xmldoc, 'thirdQuartile')
      .forEach((item: string) => { this.trackingThirdQuartileURIs.push(item) })
    getTrackingByTypeURIs(xmldoc, 'pause')
      .forEach((item: string) => { this.trackingPauseURIs.push(item) })
    getTrackingByTypeURIs(xmldoc, 'resume')
      .forEach((item: string) => { this.trackingResumeURIs.push(item) })
    getTrackingByTypeURIs(xmldoc, 'mute')
      .forEach((item: string) => { this.trackingMuteURIs.push(item) })
    getTrackingByTypeURIs(xmldoc, 'unmute')
      .forEach((item: string) => { this.trackingUnmuteURIs.push(item) })
    getTrackingByTypeURIs(xmldoc, 'fullscreen')
      .forEach((item: string) => { this.trackingFullscreenURIs.push(item) })
    getTrackingByTypeURIs(xmldoc, 'exitFullscreen')
      .forEach((item: string) => { this.trackingExitFullscreenURIs.push(item) })
    getTrackingByTypeURIs(xmldoc, 'expand')
      .forEach((item: string) => { this.trackingExpandURIs.push(item) })
    getTrackingByTypeURIs(xmldoc, 'collapse')
      .forEach((item: string) => { this.trackingCollapseURIs.push(item) })
    getAdVerifications(xmldoc)
      .forEach((item: any) => { this.adVerifications.push(item) })
    // This has to happen after we gathered all tracking events
    const adTagURI = getVASTAdTagURI(xmldoc)
    if (adTagURI !== false) {
      return this.read(adTagURI.toString())
    } else {
      // When there is no adTagURI we assume that this is the last document.
      // Either there is no mediafile for playback (empty vast 303),
      // or there is one and we have to attach all tracking events and start playback now

      const mediaFiles = xmldoc.querySelectorAll('MediaFile')

      const svp = this._StroeerVideoplayer

      let playerHls = svp.getHls()
      if (playerHls !== null) {
        playerHls.destroy()
        playerHls = null
      }

      if (mediaFiles.length > 0) {
        svp.setNoContentVideo()
        svp.deinitUI(this._originalUIName)
        svp.initUI('ivad')
        this._addEventHandlers()

        // Create trackings for all AdVerifcation / OMID Nodes
        // eslint-disable-next-line
        new OMIDUtils({
          adSessionID: this.adSessionID,
          verificationResources: this.adVerifications,
          videoEl: this.videoEl,
          player: this._StroeerVideoplayer
        })

        const onEndedCleanup = (): void => {
          this.videoEl.removeEventListener('ended', onEndedCleanup)
          this._removeEventHandlers()
          svp.deinitUI('ivad')
          svp.initUI(this._originalUIName)
          svp.setContentVideo()
          svp.setSrc(this._originalVideoSource)
          svp.loadStreamSource()
          // eslint-disable-next-line
          this.videoEl.play()
        }
        this.videoEl.addEventListener('ended', onEndedCleanup)
        const mediaFile = getMediaFileClosestTo(mediaFiles, window.innerWidth)
        if (mediaFiles[0].getAttribute('apiFramework') === 'VPAID') {
          VPAIDUtils.LoadAdUnit(
            getNodeValue(mediaFiles[0]),
            xmldoc.querySelector('Creative Linear'),
            this._StroeerVideoplayer,
            this,
            {
              clickTrackings: this.clickTrackingURIs
            }
          )
          // hide touchclick element, if available
          const touchClickEl = this._StroeerVideoplayer.getRootEl().querySelector('.video-overlay-touchclick')
          if (touchClickEl !== null) {
            touchClickEl.classList.add('hidden')
          }
        } else { // normal mp4 or whatever
          const clickThroughURL = getNodeValue(xmldoc.getElementsByTagName('ClickThrough')[0])
          let clickThroughClassName = 'video-overlay'
          const touchClickEl = this._StroeerVideoplayer.getRootEl().querySelector('.video-overlay-touchclick')
          const isTouchDevice = touchClickEl !== null
          if (isTouchDevice) {
            clickThroughClassName = 'video-overlay-touchclick'
          }

          Logger.log('VASTParser ClickThrough URL is', clickThroughURL)
          this._onClickThroughCallback = (evt: any) => {
            if (evt.target.className !== clickThroughClassName) {
              evt.preventDefault()
              return
            }
            this.videoEl.dispatchEvent(eventWrapper('IVADclick', {
              url: clickThroughURL
            }))
            Logger.log('VASTParser ClickThrough URL clicked', clickThroughURL)
            this.clickTrackingURIs.forEach((uri: string) => {
              createTrackingPixel(uri)
            })
            this.videoEl.pause()
            window.open(clickThroughURL)
          }
          this._StroeerVideoplayer.getRootEl().addEventListener('click', this._onClickThroughCallback)
          this.videoEl.src = mediaFile.src
          // eslint-disable-next-line
          this.videoEl.play()
        }
      } else {
        // empty document, no media files and no vpaid for playback found
        // track errors and continue playback
        this.errorURIs.forEach((uri: string) => {
          createErrorTrackingPixel(uri, 303)
        })
        this.videoEl.dispatchEvent(eventWrapper('IVADerror', {
          errorCode: 303,
          errorMessage: VASTErrorCodesLookup(303)
        }))
        svp.setContentVideo()
        svp.setSrc(this._originalVideoSource)
        svp.loadStreamSource()
        // eslint-disable-next-line
        this.videoEl.play()
      }
    }

    Logger.log(this)
    this._VASTDocuments.forEach((xmldoc) => { Logger.log(xmldoc) })
  }

  read (uri: string): void {
    this._VASTAdTagURIChain.push(uri)

    uri = replaceMacros(uri)

    fetch(uri)
      .then((res: any) => {
        return res.text()
      }).then((str: string) => {
        return new window.DOMParser().parseFromString(str, 'text/xml')
      }).then((xmldoc: XMLDocument) => {
        this._VASTDocuments.push(xmldoc)
        this.parse(xmldoc)
      })
  }
}

export default VASTParser
