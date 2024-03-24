import { Avansel } from '../build/avansel.js'

new Avansel(document.getElementById('pano1'))
	.sphere('/files/examples/pano-8000.jpg')
	.start()

new Avansel(document.getElementById('pano2'))
	.sphere('/files/examples/pano.jpg')
	.withTween(false)
	.start()


new Avansel(document.getElementById('pano3'))
	.multires([
		{ tileSize: 476, size: 476, fallback: true },
		{ tileSize: 512, size: 952 }
	], () => (s, l, x, y) => {
		l = parseInt(l) + 1
		return `/files/examples/multires-1/${l}/${s}${y}_${x}.jpg`
	})
	.start()

new Avansel(document.getElementById('pano4'))
	.multires([
		{ tileSize: 512, size: 512 * 2 ** 0, fallback: true },
		{ tileSize: 512, size: 512 * 2 ** 1 },
		{ tileSize: 512, size: 512 * 2 ** 2 },
		{ tileSize: 512, size: 512 * 2 ** 3 },
		{ tileSize: 512, size: 512 * 2 ** 4 },
		{ tileSize: 512, size: 512 * 2 ** 5 },
		{ tileSize: 512, size: 512 * 2 ** 6 },
		{ tileSize: 512, size: 512 * 2 ** 7 },
		{ tileSize: 512, size: 512 * 2 ** 8 },
		{ tileSize: 512, size: 512 * 2 ** 9 },
		{ tileSize: 512, size: 512 * 2 ** 10 },
		{ tileSize: 512, size: 512 * 2 ** 11 },
		{ tileSize: 512, size: 512 * 2 ** 12 },
		{ tileSize: 512, size: 512 * 2 ** 13 },
		{ tileSize: 512, size: 512 * 2 ** 14 },
		{ tileSize: 512, size: 512 * 2 ** 15 }
	], () => (s, l, x, y) => `https://dev-api.trvi.tours/tile?size=512&total=1024&side=${s}&x=${x}&y=${y}&level=${l}`)
	.start()
