import { createCamera } from './components/camera.js';
import { createPano } from './components/pano/pano.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { createControls } from './systems/controls.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

let camera
let renderer
let scene
let loop

class TVTPano {
  constructor(container, levels, source) {
    camera = createCamera(container);
    scene = createScene();
    renderer = createRenderer();    
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    const controls = createControls(camera, renderer.domElement);

    const pano = createPano(levels, source);
    const light = createLights();

    loop.updatables.push(controls);

    scene.add(pano, light);

    const resizer = new Resizer(container, camera, renderer);
  }

  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }
  
  stop() {
    loop.stop();
  }

}

export { TVTPano };