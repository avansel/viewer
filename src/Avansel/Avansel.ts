import Renderer from './systems/renderer'
import Loop from './systems/Loop'
import Controls from './systems/Controls'
import Resizer from './systems/Resizer'

import Camera from './components/Camera'
import Sphere from './components/pano/Sphere'
import Scene from './components/Scene'
import Pano from './components/pano/Pano'

//import { createPreview } from './components/pano/preview';
//import { MultiResPano } from './components/pano/MultiResPano';

//import { createHotspot, createHotspotXYZ } from './components/hotspot/hotspot';
//import { PanoControls } from './systems/PanoControls.js';

class Avansel {

  loop: Loop
  controls: Controls
  renderer: Renderer
  resizer: Resizer

  container: Element
  canvas: HTMLCanvasElement
  camera: Camera
  scene: Scene

  pano: Pano
  
  tween: boolean

  constructor(container: Element, levels: Array<Object>, source: string|Function) {
    this.container = container
    this.renderer = new Renderer(container)
    this.canvas = this.renderer.get().domElement
    this.camera = new Camera(container)
    this.resizer = new Resizer(container, this.camera, this.renderer)
  
    this.scene = new Scene()
    this.loop = new Loop(this.camera, this.scene, this.renderer)
    this.controls = new Controls(this.camera, this.canvas)

    this.loop.updatable.push(this.controls)

    this.render()
  }

  sphere(source: string){
    this.pano = new Pano().sphere(source, this.controls)
    this.scene.add(this.pano.get())
    return this
  }

  multires(levels: Array<Object>, source: Function|string){
    this.pano = new Pano().multires(levels, source, this.controls)
    this.scene.add(this.pano.get())
    return this
  }

  withTween(tween: boolean){
    this.controls.setTween(tween)
    return this
  }

  render() {
    this.renderer.get().render(this.scene.get(), this.camera.get())
  }

  start() {
    this.loop.start()
    return this
  }
  
  stop() {
    this.loop.stop();
  }

}

export { Avansel }


    /*
    if(false){ //has preview
      createPreview({
        url: '/tiles/preview.jpg',
        striporder: 'lfrbud',
        size: 256
      }).then(res => {
        this.preview = res
        this.scene.add(this.preview)
        this.pano = new MultiResPano(levels, source, this.controls, this.camera)
        const panoMesh = this.pano.createPano()
        this.scene.add(panoMesh)
        const pos = this.controls.getPosition()
        this.controls.lookAt(pos.lat, pos.lng)
        this.updatePosition()
      })  
    }else if(levels.length > 0 && typeof source == 'function'){
      this.pano = new MultiResPano(levels, source, this.controls, this.camera)
      this.scene.add(this.pano.createPano())

      const pos = this.controls.getPosition()
      this.controls.lookAt(pos.lat, pos.lng)
      this.updatePosition()
    }else{
      this.scene.add(createSphere('/files/examples/pano-8000.jpg'))

      const pos = this.controls.getPosition()
      this.controls.lookAt(pos.lat, pos.lng)
    }
    */
