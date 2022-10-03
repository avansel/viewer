import { BoxBufferGeometry, Mesh, MeshStandardMaterial, MathUtils, DoubleSide } from 'three';

const radiansPerSecond = MathUtils.degToRad(15);

function createCube() {
  const geometry = new BoxBufferGeometry(2, 2, 2);
  const material = new MeshStandardMaterial({ color: 'silver' });
  material.side = DoubleSide
  const cube = new Mesh(geometry, material);

  cube.tick = (delta) => {
    cube.rotation.z += radiansPerSecond * delta;
    cube.rotation.x += radiansPerSecond * delta;
    cube.rotation.y += radiansPerSecond * delta;
  };

  return cube;
}

export { createCube };