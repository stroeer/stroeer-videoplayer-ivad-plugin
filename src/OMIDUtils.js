import Logger from './Logger'

const OMIDUtils = function (opts) {
  opts = opts || {}
  opts.videoEl = opts.videoEl || null
  const videoEl = opts.videoEl

  let sessionStartEventsAlreadyTriggered = false

  const vendorRessources = []
  let registeredSessionObservers = []

  const verificationResources = opts.verificationResources

  const adSessionID = opts.adSessionID

  const StartSession = () => {
    // Fire the sessionStart event to each registered session observer.
    registeredSessionObservers.forEach(function (sessionObserver) {
      const observerCallback = sessionObserver.observer
      const parameters = sessionObserver.verificationParameters
      const observerParams = {
        adSessionId: adSessionID,
        type: 'sessionStart',
        timestamp: Date.now(),
        data: {
          verificationParameters: parameters,
          context: {
            apiVersion: '1.0',
            environment: 'web',
            accessMode: 'full',
            videoElement: opts.videoEl,
            adSessionType: 'html',
            adCount: 1,
            omidJsInfo: {
              omidImplementer: 'StroeerVideoplayerIvadPlugin',
              serviceVersion: '4.1.1'
            }
          }
        }
      }
      Logger.log(
        'StroeerVideoplayer',
        'OMIDUtils',
        'Event',
        'sessionStart',
        observerParams,
        sessionObserver
      )
      observerCallback(observerParams)
    })
    sessionStartEventsAlreadyTriggered = true
  }

  const getParametersFromVastForVendor = function (vendorKey) {
    let retval = null
    vendorRessources.forEach(vendorRessource => {
      Logger.log(
        'StroeerVideoplayer',
        'OMIDUtils',
        'AdVerifications Vendor Key:',
        vendorKey
      )
      if (vendorRessource.getAttribute('vendor') === vendorKey) {
        retval = vendorRessource.querySelector('JavaScriptResource')
          .textContent
      }
    })
    return retval
  }

  const registerSessionObserverImpl = function (observer, vendorKey) {
    registeredSessionObservers.push({
      observer: observer,
      verificationParameters: getParametersFromVastForVendor(vendorKey)
    })
  }

  const getUnixTimestamp = () => {
    return Math.floor(Date.now() / 1000)
  }

  const waitForSessionEventsFunc = callbackFunc => {
    if (sessionStartEventsAlreadyTriggered) {
      callbackFunc()
    } else {
      setTimeout(() => {
        waitForSessionEventsFunc(callbackFunc)
      }, 100)
    }
  }

  const addEventListenerImpl = function (type, fn) {
    if (type === 'video') {
      const onAdLoadedCb = () => {
        const _tmpdata1 = {
          type: 'loaded',
          adSessionId: adSessionID,
          timestamp: getUnixTimestamp(),
          data: {
            skippable: false,
            autoplay: false
          }
        }
        Logger.log('StroeerVideoplayer', 'OMIDUtils', 'Event', 'loaded', _tmpdata1)
        fn(_tmpdata1)
        const _tmpduration = videoEl.duration
        const t = () => {
          const _tmpdata2 = {
            type: 'start',
            adSessionId: adSessionID,
            timestamp: getUnixTimestamp(),
            data: {
              duration: videoEl.duration,
              videoPlayerVolume: videoEl.volume
            }
          }
          Logger.log('StroeerVideoplayer', 'OMIDUtils', 'Event', 'start', _tmpdata2)
          fn(_tmpdata2)
          videoEl.removeEventListener('loadedmetadata', t)
        }
        if (_tmpduration === null || isNaN(_tmpduration)) {
          videoEl.addEventListener('loadedmetadata', t)
        } else {
          t()
        }
      }
      videoEl.addEventListener('IVADimpression', () => {
        waitForSessionEventsFunc(onAdLoadedCb)
      })

      const onAdPauseCb = () => {
        const _tmpdata1 = {
          type: 'pause',
          adSessionId: adSessionID,
          timestamp: getUnixTimestamp(),
          data: {}
        }
        Logger.log('StroeerVideoplayer', 'OMIDUtils', 'Event', 'pause', _tmpdata1)
        fn(_tmpdata1)
      }
      videoEl.addEventListener('IVADpause', onAdPauseCb)

      const onAdResumeCb = () => {
        const _tmpdata1 = {
          type: 'resume',
          adSessionId: adSessionID,
          timestamp: getUnixTimestamp(),
          data: {}
        }
        Logger.log('StroeerVideoplayer', 'OMIDUtils', 'Event', 'resume', _tmpdata1)
        fn(_tmpdata1)
      }
      videoEl.addEventListener('IVADresume', onAdResumeCb)

      const onPlayerStateChangeFullscreenCb = () => {
        const _tmpdata2 = {
          type: 'playerStateChange',
          adSessionId: adSessionID,
          timestamp: getUnixTimestamp(),
          data: {
            state: 'fullscreen'
          }
        }
        Logger.log(
          'StroeerVideoplayer',
          'OMIDUtils',
          'Event',
          'playerStateChange',
          'fullscreen'
        )
        fn(_tmpdata2)
      }

      const onPlayerStateChangeExitFullscreenCb = () => {
        const _tmpdata1 = {
          type: 'playerStateChange',
          adSessionId: adSessionID,
          timestamp: getUnixTimestamp(),
          data: {
            state: 'normal'
          }
        }
        Logger.log(
          'StroeerVideoplayer',
          'OMIDUtils',
          'Event',
          'playerStateChange',
          'normal',
          _tmpdata1
        )
        fn(_tmpdata1)
      }
      videoEl.addEventListener('IVADfullscreen', onPlayerStateChangeFullscreenCb)
      videoEl.addEventListener('IVADexitFullscreen', onPlayerStateChangeExitFullscreenCb)

      const onVolumeChangeCb = () => {
        let vol = videoEl.volume
        if (videoEl.muted) vol = 0
        const _tmpdata1 = {
          type: 'volumeChange',
          adSessionId: adSessionID,
          timestamp: getUnixTimestamp(),
          data: {
            videoPlayerVolume: vol
          }
        }
        Logger.log(
          'StroeerVideoplayer',
          'OMIDUtils',
          'Event',
          'volumeChange',
          _tmpdata1
        )
        fn(_tmpdata1)
      }
      videoEl.addEventListener('volumechange', onVolumeChangeCb)

      const onAdFirstQuartileCb = () => {
        const _tmpdata1 = {
          type: 'firstQuartile',
          adSessionId: adSessionID,
          timestamp: getUnixTimestamp(),
          data: {}
        }
        Logger.log(
          'StroeerVideoplayer',
          'OMIDUtils',
          'Event',
          'firstQuartile',
          _tmpdata1
        )
        fn(_tmpdata1)
      }
      videoEl.addEventListener('IVADfirstQuartile', onAdFirstQuartileCb)

      const onAdMidpointCb = () => {
        const _tmpdata1 = {
          type: 'midpoint',
          adSessionId: adSessionID,
          timestamp: getUnixTimestamp(),
          data: {}
        }
        Logger.log('StroeerVideoplayer', 'OMIDUtils', 'Event', 'midpoint', _tmpdata1)
        fn(_tmpdata1)
      }
      videoEl.addEventListener('IVADmidpoint', onAdMidpointCb)

      const onAdThirdQuartileCb = () => {
        const _tmpdata1 = {
          type: 'thirdQuartile',
          adSessionId: adSessionID,
          timestamp: getUnixTimestamp(),
          data: {}
        }
        Logger.log(
          'StroeerVideoplayer',
          'OMIDUtils',
          'Event',
          'thirdQuartile',
          _tmpdata1
        )
        fn(_tmpdata1)
      }
      videoEl.addEventListener('IVADthirdQuartile', onAdThirdQuartileCb)

      const onAdClickCb = () => {
        const _tmpdata1 = {
          type: 'adUserInteraction',
          adSessionId: adSessionID,
          timestamp: getUnixTimestamp(),
          data: { interactionType: 'click' }
        }
        Logger.log(
          'StroeerVideoplayer',
          'OMIDUtils',
          'Event',
          'adUserInteraction',
          _tmpdata1
        )
        fn(_tmpdata1)
      }
      videoEl.addEventListener('IVADclick', onAdClickCb)

      const removeAllEventListeners = () => {
        videoEl.removeEventListener('IVADerror', onAdErrorCb)
        videoEl.removeEventListener('IVADimpression', onAdLoadedCb)
        videoEl.removeEventListener('IVADpause', onAdPauseCb)
        videoEl.removeEventListener('IVADresume', onAdResumeCb)
        videoEl.removeEventListener('volumechange', onVolumeChangeCb)
        videoEl.removeEventListener('IVADended', onAdCompleteCb)
        videoEl.removeEventListener('IVADfirstQuartile', onAdFirstQuartileCb)
        videoEl.removeEventListener('IVADmidpoint', onAdMidpointCb)
        videoEl.removeEventListener('IVADthirdQuartile', onAdThirdQuartileCb)
        videoEl.removeEventListener('IVADclick', onAdClickCb)
        videoEl.removeEventListener('IVADfullscreen', onPlayerStateChangeFullscreenCb)
        videoEl.removeEventListener('IVADexitFullscreen', onPlayerStateChangeExitFullscreenCb)
      }

      const onAdErrorCb = () => {
        removeAllEventListeners()
      }

      const onAdCompleteCb = () => {
        const _tmpdata1 = {
          type: 'complete',
          adSessionId: adSessionID,
          timestamp: getUnixTimestamp(),
          data: {}
        }
        Logger.log('StroeerVideoplayer', 'OMIDUtils', 'Event', 'complete', _tmpdata1)
        fn(_tmpdata1)
        removeAllEventListeners()

        registeredSessionObservers.forEach(function (sessionObserver) {
          const observerCallback = sessionObserver.observer
          const parameters = sessionObserver.verificationParameters
          const _tmpdata2 = {
            adSessionId: adSessionID,
            type: 'sessionFinish',
            timestamp: Date.now(),
            data: {
              verificationParameters: parameters
            }
          }
          Logger.log(
            'StroeerVideoplayer',
            'OMIDUtils',
            'Event',
            'sessionFinish',
            _tmpdata2,
            sessionObserver
          )
          observerCallback(_tmpdata2)
        })
        registeredSessionObservers = []
      }
      videoEl.addEventListener('IVADended', onAdCompleteCb)
    }
  }

  const totalToBeLoadedCounter = verificationResources.length
  let loadedCounter = 0
  const onloadedCb = function () {
    loadedCounter++
    if (loadedCounter >= totalToBeLoadedCounter) {
      StartSession()
    }
  }

  verificationResources.forEach(verificationResource => {
    vendorRessources.push(verificationResource)
    const frame = document.createElement('iframe')
    frame.style.display = 'none'
    document.body.appendChild(frame)
    const frameWin = frame.contentWindow
    // Expose OMID.
    frameWin.omid3p = {
      registerSessionObserver: registerSessionObserverImpl,
      addEventListener: addEventListenerImpl
    }
    // Load verification script.
    const verificationScript = frameWin.document.createElement('script')
    const scriptSrc = verificationResource.querySelector('JavaScriptResource')
      .textContent
    Logger.log(
      'StroeerVideoplayer',
      'OMIDUtils',
      'Verification ressource:',
      verificationResource
    )
    verificationScript.addEventListener('error', onloadedCb)
    verificationScript.addEventListener('load', onloadedCb)
    verificationScript.src = scriptSrc
    // wait and execute in the next tick, not right now
    // -- to fix weird firefox behaviour --
    setTimeout(() => {
      frameWin.document.body.appendChild(verificationScript)
    }, 0)
  })
}

export default OMIDUtils
