import { Group } from 'three';
import { createLevel } from './level.js';

function createPano(levels, source) {

  const pano = new Group();

  for(var i = 0; i < levels.length; i++){
    pano.add(createLevel(i, levels[i], source))
  }

  return pano;
}

export { createPano };