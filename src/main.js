import { AvanselViewer } from './AvanselViewer/AvanselViewer.ts'

function main(){
	const container = document.querySelector('#avansel')

	/*
  	const avansel = new AvanselViewer(container, [
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
		],
		() => (s, l, x, y) => `https://dev-api.trvi.tours/tile?size=512&total=1024&side=${s}&x=${x}&y=${y}&level=${l}`
	)
	*/

	const avansel = new AvanselViewer(container, [
		{ tileSize: 512, size: 640, fallback: true },
		{ tileSize: 512, size: 1280 },
		{ tileSize: 512, size: 2560 },
		{ tileSize: 512, size: 4864 },
	],
	() => (s, l, x, y) => {
		l = parseInt(l) + 1
		x = ((x + 1) + '').padStart(2, '0')
		y = ((y + 1) + '').padStart(2, '0')
		return `/tiles/${s}/l${l}/${y}/l${l}_${s}_${y}_${x}.jpg`
	})

	avansel.start()

}

main()