import { TVTPano } from './TVTPano/TVTPano.js'

function main(){
	const container = document.querySelector('#pano')
  	const pano = new TVTPano(container, [
			{ tileSize: 512, size: 640 },
			{ tileSize: 512, size: 1280 },
			{ tileSize: 512, size: 2560 },
			{ tileSize: 512, size: 4864 }
		],
		() => (s, l, x, y) => {
            l = l + 1
			x = ((x + 1) + '').padStart(2, '0')
            y = ((y + 1) + '').padStart(2, '0')
            return `/tiles/${s}/l${l}/${y}/l${l}_${s}_${y}_${x}.jpg`
        }
	)
	pano.start()
}

main()