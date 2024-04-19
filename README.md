# Avansel Viewer

Free Easy to use Opensource JavaScript Three.js based panorama / virtual tours viewer

## Why

* Free
* Easy to use
* Opensource

## Features

* [Multiresolution](https://avansel.github.io/documentation/#multires)
* Plugins and Modules
* Support hotspots, polygons


## Installing using npm

```
npm i avansel
```
See more ways to install in the [documentaion](https://avansel.github.io/documentation/).

## Get Started

HTML
```html
<div id="pano"></div>
```

Javascript
```javascript
import { Avansel } from "avansel"
new Avansel(document.querySelector('#pano'))
  .sphere('/assets/pano.jpg')
  .start()
```
## Examples

* [Demo / Examples](https://avansel.github.io/examples/)

## Avansel Sponsors

We would like to extend our thanks to the following sponsors for funding Avansel development. If you are interested in becoming a sponsor, please visit the Avansel [Patreon page](https://www.patreon.com/grinev).

## Premium Partners

* [Virturos](https://virturos.com)
* [Avansel](https://avansel.com)
* [TrueVirtualTours](https://truevirtualtours.com)
* [Grinev Studio](https://grinev.studio)

## Contributing

Thank you for considering contributing to the Avansel Viewer!
* Star the repository
* [Participate in discussions](https://github.com/avansel/viewer/discussions): ask questions, share your ideas
* [Bug Reports](https://github.com/avansel/viewer/issues)

## Security Vulnerabilities

If you discover a security vulnerability within Avansel Viewer, please send an e-mail to Roman Grinev via roman@avansel.com. All security vulnerabilities will be promptly addressed.

## License

The Avansel Viewer is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

