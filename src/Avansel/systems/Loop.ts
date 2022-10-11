import { Clock, PerspectiveCamera, Scene as ThreeScene, WebGLRenderer } from 'three';
import Camera from '../Components/Camera';
import Scene from '../Components/Scene';
import Controls from './Controls';
import Renderer from './renderer';

const clock = new Clock();

export default class Loop {

    camera: PerspectiveCamera
    scene: ThreeScene
    renderer: WebGLRenderer
    updatable: Array<Controls>
    
    constructor(camera: Camera, scene: Scene, renderer: Renderer) {
        this.camera = camera.get()
        this.scene = scene.get()
        this.renderer = renderer.get()
        this.updatable = []
    }

    start() {
        this.renderer.setAnimationLoop((t) => {
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
