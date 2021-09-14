Ströer Videoplayer Plugin Interactive Video Ads
===============================================

## Development

Install via dependencies via `yarn --dev`.

Build via `yarn run build`. Lint via `yarn run lint`. Test via `yarn run test`.

See coverage with `yarn run test --coverage`.

## Usage

### Events

 - IVADerror
 - IVADimpression
 - IVADpause
 - IVADresume
 - IVADclick
 - IVADmute
 - IVADunmute
 - IVADfullscreen
 - IVADexitFullscreen
 - IVADfirstQuartile
 - IVADmidpoint
 - IVADthirdQuartile
 - IVADended

### Basic Markup

```html
<script src="StroeerVideoplayer.umd.js"></script>
<link rel="stylesheet" href="StroeerVideoplayer.css" />

<script src="StroeerVideoplayer-default-ui.umd.js"></script>
<link rel="stylesheet" href="StroeerVideoplayer-default-ui.css" />

<script src="StroeerVideoplayer-ivad-ui.umd.js"></script>
<link rel="stylesheet" href="StroeerVideoplayer-ivad-ui.css" />

<script src="StroeerVideoplayer-ivad-plugin.umd.js"></script>

<video id="myvideoplayer1"
	class="stroeervideoplayer"
	poster="https://videos.giga.de/files/1307753225/720p.jpg"
	preload="metadata"
	playsinline
	controls
	data-ivad-preroll-adtag="https://your-vast.com/adtag.xml">
	<source src="https://vid-cdn60.stroeermb.de/787303133_v4/playlist.m3u8" type="application/x-mpegURL" />
</video>

<script>
	StroeerVideoplayer.registerUI(StroeerVideoplayerDefaultUI);
	StroeerVideoplayer.registerUI(StroeerVideoplayerIvadUI)
	StroeerVideoplayer.registerPlugin(StroeerVideoplayerIvadPlugin)
	const video = document.getElementById('myvideoplayer1')
	const myvideoplayer1 = new StroeerVideoplayer(video)
	myvideoplayer1.loadStreamSource()
	myvideoplayer1.initPlugin('ivad')
</script>
```

