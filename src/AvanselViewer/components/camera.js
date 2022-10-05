import { PerspectiveCamera } from 'three';

function createCamera(container) {

  const fov = 70;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 200;

  const camera = new PerspectiveCamera(fov, aspect, near, far);

  camera.position.set(0, 0, 0);

  camera.tick = (delta) => { }

  return camera;
}

export { createCamera };