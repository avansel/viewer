import { Clock } from 'three';
import { update } from '@tweenjs/tween.js'

const clock = new Clock();


class Loop {

    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.updatable = [];
    }

    start() {
        this.renderer.setAnimationLoop((t) => {
            update(t)
            this.tick();
            this.renderer.render(this.scene, this.camera);
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    tick() {
        const delta = clock.getDelta();
        for (const object of this.updatable) {
            object.tick(delta)
        }
    }

}

export { Loop }