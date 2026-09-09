# Avansel Viewer

Avansel Viewer is an open source JavaScript panorama viewer built on top of Three.js.

It currently provides a small viewer core for:

- equirectangular sphere panoramas
- multiresolution tiled panoramas
- mouse and touch navigation
- zoom and smooth camera movement

## What this project does

The library renders a panorama inside a DOM container and manages:

- WebGL renderer creation
- perspective camera setup
- render loop
- resize handling
- mouse and touch controls
- tile visibility updates for multires panoramas

This repository also contains a local demo page and a small Express server for development.

## Current project status

The supported public API is intentionally small and focused on viewing panoramas.

Documented and implemented today:

- `sphere(source)`
- `multires(levels, source)`
- `withTween(enabled)`
- `start()`
- `stop()`

There are also internal helpers for hotspots and preview generation in the source tree, but they are not exposed as a stable public API in the current package.

## Installation

```bash
npm i avansel
```

## Quick start

### HTML

```html
<div id="pano" style="width: 100%; height: 400px;"></div>
```

### JavaScript

```javascript
import { Avansel } from "avansel"

new Avansel(document.querySelector("#pano"))
  .sphere("/assets/pano.jpg")
  .start()
```

## Public API

### `new Avansel(container)`

Creates a viewer instance inside the provided DOM element.

- `container`: target HTML element that will receive the renderer canvas

### `sphere(source)`

Loads a single equirectangular panorama texture on an inverted sphere.

- `source`: URL to the panorama image

Returns the current viewer instance.

### `multires(levels, source)`

Loads a multiresolution tiled panorama rendered as cube faces.

- `levels`: array of level definitions
- `source`: tile URL source, typically a function that receives tile coordinates

Returns the current viewer instance.

### `withTween(enabled)`

Enables or disables smooth interpolation for camera movement and zoom.

- `enabled`: boolean

Returns the current viewer instance.

### `start()`

Starts the render loop.

Returns the current viewer instance.

### `stop()`

Stops the render loop.

## Multiresolution format

The multires mode expects an array of level definitions:

```javascript
[
  { tileSize: 476, size: 476, fallback: true },
  { tileSize: 512, size: 952 }
]
```

### Level fields

- `tileSize`: tile size in pixels for that level
- `size`: total panorama face size represented by the level
- `fallback`: optional flag that marks a level as the always-available base layer

### Tile source function

The tile source is usually defined as a function returning a resolver:

```javascript
( ) => (side, level, x, y) => `/tiles/${level}/${side}${y}_${x}.jpg`
```

The resolver receives:

- `side`: cube face name: `f`, `b`, `l`, `r`, `u`, `d`
- `level`: zero-based level index
- `x`: tile x coordinate
- `y`: tile y coordinate

Avansel recalculates the visible faces and tiles when camera position or FOV changes.

## Events

The viewer dispatches custom events from the internal canvas element.

### `cameraMove`

Triggered when camera latitude or longitude changes.

`detail` payload:

```javascript
{ lat, lng }
```

### `fovChanged`

Triggered when field of view changes.

`detail` payload:

```javascript
{ fov }
```

### `panoClick`

Triggered when the user clicks without dragging.

`detail` payload:

```javascript
PointerEvent
```

### Event usage

```javascript
const viewer = new Avansel(document.querySelector("#pano"))
  .sphere("/assets/pano.jpg")
  .start()

const canvas = document.querySelector("#pano canvas")

canvas.addEventListener("cameraMove", (event) => {
  console.log(event.detail.lat, event.detail.lng)
})

canvas.addEventListener("fovChanged", (event) => {
  console.log(event.detail.fov)
})

canvas.addEventListener("panoClick", (event) => {
  console.log(event.detail)
})
```

## User interaction

Supported interaction in the current implementation:

- mouse drag to rotate
- touch drag to rotate
- mouse wheel to zoom
- pinch to zoom
- optional tweened movement and zoom

## Development

### Scripts

```bash
npm install
npm run build
npm run dev
npm start
```

### What the scripts do

- `npm run build`: builds the library and demo bundle with Rollup
- `npm run dev`: runs Rollup in watch mode
- `npm start`: starts the local Express demo server on port `3000`

### Local demo

After `npm start`, open:

- `http://127.0.0.1:3000`

The demo page shows:

- 2 sphere panorama examples
- 2 multires panorama examples

## Testing existing functionality

This repository does not currently include automated tests, so the existing functionality should be verified manually after changes.

### Minimum regression checklist

#### Build and startup

- run `npm install`
- run `npm run build`
- run `npm start`
- open the local demo page
- confirm the page loads without console errors

#### Sphere panorama

- verify the first sphere panorama renders
- drag with the mouse and confirm rotation works
- use the mouse wheel and confirm zoom works
- verify the second sphere panorama renders
- confirm `withTween(false)` removes smooth interpolation behavior

#### Multires panorama

- verify each multires example renders
- move the camera and confirm tiles load as the view changes
- zoom in and confirm higher detail tiles appear
- zoom out and confirm fallback or lower detail tiles remain visible
- confirm no broken tile requests are produced for visible areas

#### Resize behavior

- resize the browser window
- confirm the renderer resizes correctly
- confirm the panorama remains interactive after resize

#### Touch behavior

- verify single-touch drag rotates the panorama
- verify two-finger pinch changes FOV
- verify touch interaction does not freeze after touch end

#### Event behavior

- attach listeners for `cameraMove`, `fovChanged`, and `panoClick`
- confirm `cameraMove` fires during drag
- confirm `fovChanged` fires during wheel zoom and pinch zoom
- confirm `panoClick` fires only for click/tap without drag

### Recommended next testing work

If the project continues to grow, the next useful additions would be:

- automated smoke tests for build output
- browser-based interaction tests for sphere navigation
- browser-based interaction tests for multires tile loading
- event contract tests for `cameraMove`, `fovChanged`, and `panoClick`

## Current limitations

- no automated tests are included yet
- the public API is intentionally small
- hotspots, polygons, plugins, and preview helpers are not documented as stable public features in this package version
- the package is focused on viewer runtime behavior, not authoring or tour editing

## Examples

- [Demo / Examples](https://avansel.github.io/examples/)

## Avansel Sponsors

We would like to extend our thanks to the following sponsors for funding Avansel development. If you are interested in becoming a sponsor, please visit the Avansel [Patreon page](https://www.patreon.com/grinev).

## Premium Partners

- [Virturos](https://virturos.com)
- [Avansel](https://avansel.com)
- [TrueVirtualTours](https://truevirtualtours.com)
- [Grinev Studio](https://grinev.studio)

## Contributing

Thank you for considering contributing to the Avansel Viewer.

- Star the repository
- [Participate in discussions](https://github.com/avansel/viewer/discussions)
- [Report bugs](https://github.com/avansel/viewer/issues)

## Security Vulnerabilities

If you discover a security vulnerability within Avansel Viewer, please send an e-mail to Roman Grinev via roman@grinev.studio. All security vulnerabilities will be promptly addressed.

## License

Avansel Viewer is open source software licensed under the [MIT license](https://opensource.org/licenses/MIT).
