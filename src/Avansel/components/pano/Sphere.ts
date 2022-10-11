import { SphereGeometry, Mesh, MeshBasicMaterial, TextureLoader, Texture } from 'three'
import { pano } from '../../config.json'
import Controls from '../../systems/Controls'

export default class Sphere{

  instance: Mesh
  imageWidth: number

  constructor(source: string, controls: Controls){
    const geometry = new SphereGeometry( pano.tileBase, 64, 64 )
    geometry.scale( - 1, 1, 1 )
    const texture = new TextureLoader().load( source, (texture: Texture) => {
      const pd = texture.source.data.width / 360
      const fovMin = controls.canvas.clientWidth / pd
      controls.fovMin = fovMin / pano.pixelZoom
    } )
    const material = new MeshBasicMaterial( { map: texture } )
    this.instance =  new Mesh( geometry, material )
  }

  get(): Mesh{
    return this.instance
  }
}
