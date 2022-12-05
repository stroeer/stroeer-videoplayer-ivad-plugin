import Logger from './Logger'
import noop from './noop'
import eventWrapper from './eventWrapper'
import createTrackingPixel from './VASTParser/createTrackingPixel'
import OMIDUtils from './OMIDUtils'

let VPAIDCreative = null

function GetIframeDocument (ifr) {
  const ifrDoc = ifr.contentWindow && ifr.contentWindow.document
  if (!ifrDoc) return false
  return ifrDoc
}

const CheckVPAIDInterface = function (VPAIDCreative) {
  if (
    VPAIDCreative.handshakeVersion &&
    typeof VPAIDCreative.handshakeVersion === 'function' &&
    VPAIDCreative.initAd &&
    typeof VPAIDCreative.initAd === 'function' &&
    VPAIDCreative.startAd &&
    typeof VPAIDCreative.startAd === 'function' &&
    VPAIDCreative.stopAd &&
    typeof VPAIDCreative.stopAd === 'function' &&
    VPAIDCreative.skipAd &&
    typeof VPAIDCreative.skipAd === 'function' &&
    VPAIDCreative.resizeAd &&
    typeof VPAIDCreative.resizeAd === 'function' &&
    VPAIDCreative.pauseAd &&
    typeof VPAIDCreative.pauseAd === 'function' &&
    VPAIDCreative.resumeAd &&
    typeof VPAIDCreative.resumeAd === 'function' &&
    VPAIDCreative.expandAd &&
    typeof VPAIDCreative.expandAd === 'function' &&
    VPAIDCreative.collapseAd &&
    typeof VPAIDCreative.collapseAd === 'function' &&
    VPAIDCreative.subscribe &&
    typeof VPAIDCreative.subscribe === 'function' &&
    VPAIDCreative.unsubscribe &&
    typeof VPAIDCreative.unsubscribe === 'function'
  ) {
    return true
  }
  return false
}

const checkIfrLoaded = function (cw, cb) {
  const c = cw.__LOADED
  cb = cb || noop
  if (c && c === true) {
    const fn = cw.getVPAIDAd
    if (fn && typeof fn === 'function') {
      VPAIDCreative = fn()
      if (CheckVPAIDInterface(VPAIDCreative)) {
        // eslint-disable-next-line
        cb(false, VPAIDCreative)
      } else {
        // eslint-disable-next-line
        cb('No valid VPAID', {})
      }
    } else {
      Logger.log(
        'error',
        'VPAIDUtils',
        'iframe has been fully loaded, but getVPAIDAd is not a fn, but this:',
        fn
      )
    }
  } else {
    setTimeout(() => {
      checkIfrLoaded(cw, cb)
    }, 200)
  }
}

function CreateIframe (url, currentAd, stroeervideoplayer, vastparser, opts, omidParams) {
  const ifr = document.createElement('iframe')
  ifr.href = 'about:blank'
  ifr.setAttribute(
    'style',
    'height:1px;width:1px;border:0 none;position:absolute;top:-10px;left:-10px;'
  )
  ifr.id = 'VPAIDAdLoaderFrame' + Date.now()
  const onIframeWriteCb = function () {
    const cw = ifr.contentWindow
    checkIfrLoaded(cw, (VPAIDCreativeErr, VPAIDCreative) => {
      if (VPAIDCreativeErr) {
        Logger.log(
          'error',
          'VPAIDUtils',
          VPAIDCreativeErr,
          VPAIDCreative
        )
        return
      }
      Logger.log('VPAIDUtils', 'VPAID is', VPAIDCreative)
      Logger.log('VPAIDUtils', 'VPAID currentAd', currentAd)
      const videoEl = stroeervideoplayer.getVideoEl()

      function _onfullscreenchange (evt) {
        Logger.log('VPAIDUtils', 'fullscreenchange', evt)
        VPAIDCreative.resizeAd(videoEl.offsetWidth, videoEl.offsetHeight, 'normal')
      }

      function _onorientationchange (evt) {
        Logger.log('VPAIDUtils', 'orientationchange', evt)
        setTimeout(function () {
          VPAIDCreative.resizeAd(
            videoEl.offsetWidth,
            videoEl.offsetHeight,
            'normal'
          )
        }, 500)
      }

      stroeervideoplayer.getRootEl().addEventListener('fullscreenchange', _onfullscreenchange)
      window.addEventListener('orientationchange', _onorientationchange)

      function _cleanupListeners () {
        VPAIDCreative.off('AdError', onAdError)
        VPAIDCreative.off('AdLoaded', onInit)
        VPAIDCreative.off('AdVideoStart', onAdVideoStart)
        VPAIDCreative.off('AdSkipped', onAdSkipped)
        VPAIDCreative.off('AdStopped', onAdStop)
        VPAIDCreative.off('AdVideoComplete', onVideoComplete)
        VPAIDCreative.off('AdClickThru', onAdClickThru)
        stroeervideoplayer.getRootEl()
          .removeEventListener('fullscreenchange', _onfullscreenchange)
        window.removeEventListener('orientationchange', _onorientationchange)
      }

      function onInit () {
        Logger.log('VPAIDUtils', 'VPAID onInit')
        // OMID
        // Create trackings for all AdVerifcation / OMID Nodes
        // eslint-disable-next-line
        new OMIDUtils(omidParams)
        stroeervideoplayer.getUIEl().querySelector('.controlbar-container').classList.add('hidden')
        VPAIDCreative.startAd()
      }

      function ResumeOrigVideo () {
        _cleanupListeners()
        const videoEl = stroeervideoplayer.getVideoEl()
        const svp = stroeervideoplayer
        svp.setContentVideo()
        videoEl.removeAttribute('src')
        videoEl.load()
        svp.setSrc(vastparser._originalVideoSource)
        svp.loadStreamSource()
        svp.getHls().startLoad()
        videoEl.load()
        // this seems to fix a bug in safari,
        // where the video is not playing correctly after the ad is finished
        // it just shows a black screen with audio
        // eslint-disable-next-line
        videoEl.play().then(
          () => {
            videoEl.pause()
            // eslint-disable-next-line
            videoEl.play()
          }
        )
      }

      function onVideoComplete () {
        Logger.log('VPAIDUtils', 'VPAID onVideoComplete')
        const videoEl = stroeervideoplayer.getVideoEl()
        videoEl.dispatchEvent(new Event('beforeSlotRemoval'))
        if (!VPAIDCreative.videoElEndedHasFired) {
          VPAIDCreative.videoElEndedHasFired = true
          videoEl.dispatchEvent(new Event('ended'))
        }
        vastparser.reset()
        stroeervideoplayer.deinitUI('ivad')
        stroeervideoplayer.initUI(vastparser._originalUIName)
        ResumeOrigVideo()
      }

      function onAdSkipped () {
        Logger.log('VPAIDUtils', 'VPAID Ad skipped')
        Logger.log('Event', 'IVADskip')
        Logger.log('Event', 'IVADvpaidSkip')
        const videoEl = stroeervideoplayer.getVideoEl()
        videoEl.dispatchEvent(new Event('beforeSlotRemoval'))
        videoEl.dispatchEvent(new Event('IVADskip'))
        videoEl.dispatchEvent(new Event('IVADvpaidSkip'))
        // Kill tracking events
        vastparser.reset()
        stroeervideoplayer.deinitUI('ivad')
        stroeervideoplayer.initUI(vastparser._originalUIName)
        ResumeOrigVideo()
      }

      function onAdStop () {
        Logger.log('VPAIDUtils', 'VPAID Ad stop')
        const videoEl = stroeervideoplayer.getVideoEl()
        videoEl.dispatchEvent(new Event('beforeSlotRemoval'))
        // Kill tracking events
        vastparser.reset()
        stroeervideoplayer.deinitUI('ivad')
        stroeervideoplayer.initUI(vastparser._originalUIName)
        ResumeOrigVideo()
      }

      function onAdError (errorMessage) {
        const errorCode = 405
        Logger.log(
          'Event',
          'IVADerror',
          {
            errorCode: errorCode,
            errorMessage: errorMessage
          }
        )
        stroeervideoplayer.getVideoEl().dispatchEvent(eventWrapper('IVADerror', {
          errorCode: errorCode,
          errorMessage: errorMessage
        }))

        const videoEl = stroeervideoplayer.getVideoEl()
        videoEl.dispatchEvent(new Event('beforeSlotRemoval'))

        // Kill tracking events
        vastparser.reset()
        stroeervideoplayer.deinitUI('ivad')
        stroeervideoplayer.initUI(vastparser._originalUIName)
        ResumeOrigVideo()
      }

      function onAdClickThru (url, id, playerHandles) {
        Logger.log('VPAID', 'AdClickThru')
        opts.clickTrackings.forEach(trackingURL => {
          Logger.log(
            'VPAIDUtils',
            'Event',
            'ClickThru ClickTracking',
            trackingURL
          )
          createTrackingPixel(trackingURL)
        })
        Logger.log(
          'Event',
          'IVADclick',
          url
        )
        stroeervideoplayer.getVideoEl().dispatchEvent(eventWrapper('IVADclick', {
          url: url
        }))
        if (playerHandles) {
          window.open(url)
        }
      }

      function onAdVideoStart () {
        stroeervideoplayer.getUIEl().querySelector('.controlbar-container').classList.remove('hidden')
      }

      VPAIDCreative.off = function (n, cb) {
        this.unsubscribe(cb, n)
      }

      VPAIDCreative.on = function (n, cb) {
        this.subscribe(cb, n)
      }

      VPAIDCreative.videoElEndedHasFired = false;

      stroeervideoplayer.getVideoEl().addEventListener('ended', () => {
        VPAIDCreative.videoElEndedHasFired = true
      })

      VPAIDCreative.on('AdError', onAdError)
      VPAIDCreative.on('AdLoaded', onInit)
      VPAIDCreative.on('AdVideoStart', onAdVideoStart)
      VPAIDCreative.on('AdSkipped', onAdSkipped)
      VPAIDCreative.on('AdStopped', onAdStop)
      VPAIDCreative.on('AdVideoComplete', onVideoComplete)
      VPAIDCreative.on('AdClickThru', onAdClickThru)

      let adParamsTxt = ''
      const adParamsNode = currentAd.querySelector('AdParameters')
      if (adParamsNode) {
        adParamsTxt = adParamsNode.textContent
      }

      Logger.log('VPAIDUtils', 'VPAID adParams', adParamsTxt)

      VPAIDCreative.initAd(
        videoEl.offsetWidth,
        videoEl.offsetHeight,
        'normal',
        -1,
        { AdParameters: adParamsTxt },
        {
          slot: stroeervideoplayer.getRootEl().querySelector('.video-overlay'),
          videoSlot: stroeervideoplayer.getVideoEl(),
          videoSlotCanAutoPlay: false
        }
      )
    })
  }
  document.body.appendChild(ifr)
  const ifrDoc = GetIframeDocument(ifr)
  ifrDoc.write(
    '<!DOCTYPE html+' +
      '>' +
      '<he' +
      'ad><ti' +
      'tle></ti' +
      'tle></he' +
      'ad><bo' +
      'dy><script src="' +
      url +
      '"></scr' +
      'ipt>' +
      '<scr' +
      'ipt>__LOADED=true;' +
      '</scr' +
      'ipt></body></html>'
  )
  onIframeWriteCb()
}

function LoadAdUnit (url, currentAd, stroeervideoplayer, vastparser, opts, omidParams) {
  Logger.log('VPAIDUtils', 'Loading VPAID URL:', url)
  CreateIframe(url, currentAd, stroeervideoplayer, vastparser, opts, omidParams)
}

const VPAIDUtils = {
  LoadAdUnit
}

export default VPAIDUtils
