import { createCamera } from './components/camera.js';
import { createPreview } from './components/pano/preview';
import { MultiResPano } from './components/pano/MultiResPano';
import { createHotspot, createHotspotXYZ } from './components/hotspot/hotspot';
import { createScene } from './components/scene.js';
import { createControls } from './systems/controls.js';
import { latLngToPos } from './components/utils'

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { PanoControls } from './systems/PanoControls.js';

import { Group, Mesh, Vector2, WebGLRenderer, PerspectiveCamera, Scene } from 'three';

//import Stats from 'stats.js'

class Vizio360Player {

  camera: PerspectiveCamera
  renderer: WebGLRenderer
  scene: Scene
  loop: Loop
  controls: PanoControls
  resizer: Resizer
  pano: MultiResPano
  preview: Mesh

  constructor(container: Element, levels: Array<Object>, source: Function) {
    this.camera = createCamera(container)
    this.scene = createScene()
    this.renderer = createRenderer()

    this.loop = new Loop(this.camera, this.scene, this.renderer)
    container.append(this.renderer.domElement);
  
    this.controls = createControls(this.camera, this.renderer.domElement);

    if(true){ //has preview
      createPreview({
        url: '/tiles/preview.jpg',
        striporder: 'lfrbud',
        size: 256
      }).then(res => {
        this.preview = res
        this.scene.add(this.preview)
        this.pano = new MultiResPano(levels, source, this.controls)
        const panoMesh = this.pano.createPano()
        this.scene.add(panoMesh)
      })  
    }else{
      this.pano = new MultiResPano(levels, source, this.controls)
      this.scene.add(this.pano.createPano())
    }

    this.resizer = new Resizer(container, this.camera, this.renderer);

    this.loop.updatables.push(this.controls)

    this.loop.updatables.push({tick(){
      //
    }});

    this.renderer.domElement.addEventListener('onPanoClick', (e: CustomEvent) => this.onPanoClick(e))
    this.renderer.domElement.addEventListener('onCameraMove', (e: Event) => this.onCameraMove(e))
    this.renderer.domElement.addEventListener('onFovChanged', (e: Event) => this.onFovChanged(e))

    // TODO: udpate this
    this.resizer.setOnResize(() => {
      //
    })

    this.render()
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  start() {
    this.loop.start();
  }
  
  stop() {
    this.loop.stop();
  }

  onPanoClick(e: CustomEvent){
    //console.log('click', e.detail);
  }

  onCameraMove(e: Event){
    this.pano.onPosFovChanged( this.controls.getPosition(), this.controls.getFov(), this.preview, this.camera )
    this.pano.addUpdateVisible()
  }

  onFovChanged(e: Event){
    this.pano.onPosFovChanged( this.controls.getPosition(), this.controls.getFov(), this.preview, this.camera )
    this.pano.addUpdateVisible()
  }

}

export { Vizio360Player };