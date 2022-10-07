## Avansel Viewer

Avansel Viewer is a Free Opensource ThreeJS based JavaScript library that let you view 360° panoramas and create virtual tours from them.

There are some commercial solutions in the market but yet no opensource solution that would be flexable, extandable, and supported. We want to have a JavaScript Panorama/Virtual Tour viewer that:

* Based on widely known JavaScript 3D library
* Easy to use
* Free to use in any project
* Support of third-party plugins and modules
* Support multiresolution
* Support hotspots, polygons, etc

## Installing
### Using npm

```
npm i avansel/viewer
```

## Multiresolution panorama viewer exampe

index.html
```html
<!doctype html>
<html>
  <head>
    <title>Avansel Pano Viewer</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      body, html { margin: 0; padding: 0; overflow: hidden; }
      #pano{ height: 100vh; width: 100vw; }
    </style>
  </head>
  <body>
    <div id="pano"></div>
    <script src="/dist/main.js"></script>
  </body>
</html>
```
main.js
```javascript
import { AvanselViewer } from './AvanselViewer/AvanselViewer.ts'

function main(){
	const container = document.querySelector('#pano')

	const avansel = new AvanselViewer(container, [
		{ tileSize: 512, size: 640, fallback: true },
		{ tileSize: 512, size: 1280 },
		{ tileSize: 512, size: 2560 },
		{ tileSize: 512, size: 4864 }
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
```
## Examples

* [Multi resolution/Petapixel sintetic panorama](https://jsfiddle.net/grinevri/8ntfmsxh/25/)

## Avansel Sponsors

We would like to extend our thanks to the following sponsors for funding Avansel development. If you are interested in becoming a sponsor, please visit the Avansel [Patreon page](https://www.patreon.com/grinev).

### Premium Partners

* [Avansel](https://avansel.com)
* [TrueVirtualTours](https://truevirtualtours.com)

## Contributing

Thank you for considering contributing to the Avansel Viewer! 
* Bug Reports


## Security Vulnerabilities

If you discover a security vulnerability within Avansel Viewer, please send an e-mail to Roman Grinev via roman@grinev.software. All security vulnerabilities will be promptly addressed.

## License

The Avansel Viewer is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

