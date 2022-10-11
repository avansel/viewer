import { MathUtils, PerspectiveCamera } from 'three'
import { camera } from '../config.json'
const { near, far, fov } = camera

export default class Camera {
  instance: PerspectiveCamera
  tick: Function

  constructor(container: Element){
    const aspect = container.clientWidth / container.clientHeight
    this.instance = new PerspectiveCamera(fov, aspect, near, far)
    this.instance.position.set(0, 0, 0)
    this.tick = (delta: number) => {
      console.log('camera tick')
    }
  }

  setAspect(aspect: number){
    this.instance.aspect = aspect
    this.instance.updateProjectionMatrix()
  }

  get(){
    return this.instance
  }

  lookAt(lat: number, lng: number){
    lat = Math.max( - 90, Math.min( 89.9999999999, lat ) )
    var phi = MathUtils.degToRad( 90 - lat )
    var theta = MathUtils.degToRad( lng )
    const x = 500 * Math.sin( phi ) * Math.cos( theta )
    const y = 500 * Math.cos( phi )
    const z = 500 * Math.sin( phi ) * Math.sin( theta )
    this.instance.lookAt(x, y, z)
  }

  setFov(fov: number){
    this.instance.fov = fov
    this.instance.updateProjectionMatrix()
  }

}
