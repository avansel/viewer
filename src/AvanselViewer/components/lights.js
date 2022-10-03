import { AmbientLight } from 'three';

function createLights() {
    const light = new AmbientLight( 0xffffff );
    return light;
}

export { createLights };