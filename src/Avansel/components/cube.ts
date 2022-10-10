import { BoxBufferGeometry, Mesh, MeshStandardMaterial, DoubleSide } from 'three';

function createCube() {
  const geometry = new BoxBufferGeometry(2, 2, 2);
  const material = new MeshStandardMaterial({ color: 'silver' });
  material.side = DoubleSide
  const cube = new Mesh(geometry, material);
  return cube;
}

export { createCube };