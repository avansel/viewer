import { PanoControls } from './PanoControls.js';

function createControls(camera, canvas) {
    const controls = new PanoControls(camera, canvas);
    return controls;
}

export { createControls };