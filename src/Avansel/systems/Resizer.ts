import Camera from "../Components/Camera";
import Renderer from "./renderer";

export default class Resizer {

  container: Element
  camera: Camera
  renderer: Renderer

  constructor(container: Element, camera: Camera, renderer: Renderer) {

    this.container = container
    this.camera = camera
    this.renderer = renderer

    this.setSize()

    window.addEventListener('resize', () => this.setSize())
  }

  setSize(){
    const aspect = this.container.clientWidth / this.container.clientHeight
    this.camera.setAspect(aspect)
    this.renderer.setSize()
  }
}
