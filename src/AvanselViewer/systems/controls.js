import { PanoControls } from './PanoControls.js';

function createControls(camera, canvas, shouldTween) {
    const controls = new PanoControls(camera, canvas, shouldTween);
    return controls;
}

export { createControls };