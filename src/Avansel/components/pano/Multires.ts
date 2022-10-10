import { Group, Mesh, Vector2, Raycaster, PerspectiveCamera, Vector3 } from 'three'
import { createSide, updateSide, deleteSide } from './side.js'
import { tilesFor } from '../utils'
import { createCube } from './cube'
import { pano } from '../../config.json'
import Controls from '../../systems/Controls.js'

class Multires {

  levels: Array<any>
  source: Function | string
  controls: Controls
  camera: PerspectiveCamera
  instance: Group
  pos: Object
  fov: number
  visible: any
  pixelsMin: number
  pixelsMax: number
  cube: Mesh

  constructor(levels: Array<any>, source: Function | string, controls: Controls) {
    this.pixelsMin = 0.5
    this.pixelsMax = 5
    this.levels = levels
    this.source = source
    this.controls = controls
    this.camera = controls.camera.get()
    this.visible = {
      pixels: [],
      maxLevel: 0,
      sides: {},
      meshes: []
    }
    this.cube = createCube()

    this.controls.canvas.addEventListener( 'cameraMove', this.onCameraMove.bind(this) )
    this.controls.canvas.addEventListener( 'fovChanged', this.onFovChanged.bind(this) )
  }

  get(): Group{
    return this.instance
  }

  createPano(){
    this.instance = new Group();
    this.instance.renderOrder = 2
    this.instance.name = 'multires-pano'
    return this.instance
  }

  pixelsBySize(size: number, fov: number){
    const height = this.controls.canvas.parentElement.clientHeight;
    const number = height / (0.9 * fov * size / 100)
    return {
        number,
        visible: number >= this.pixelsMin && number <= this.pixelsMax
    }
  }

  minFov(size: number, max: number){
    const height = this.controls.canvas.parentElement.clientHeight;
    return (height * 100) / (size * 0.9 * max)
  }

  pointSideXY(point: Vector3){
    const size = ( pano.maxLevels + pano.tileBase + 2 )
    const mul = 1000000
    const hs = size / 2
    const hsMul = (hs * mul)
    const x = Math.round(point.x * mul)
    const y = Math.round(point.y * mul)
    const z = Math.round(point.z * mul)
    if(z === hsMul) return { side: 'f', x: 1 - (point.x + hs) / size, y: 1 - (point.y + hs) / size }
    if(z === -hsMul) return { side: 'b', x: (point.x + hs) / size, y: 1 - (point.y + hs) / size }
    if(x === hsMul) return { side: 'l', x: (point.z + hs) / size, y: 1- (point.y + hs) / size }
    if(x === -hsMul) return { side: 'r', x: (hs - point.z) / size, y: 1 - (point.y + hs) / size  }
    if(y === hsMul) return { side: 'u', x: 1- (point.x + hs) / size, y: (point.z + hs) / size }
    if(y === -hsMul) return { side: 'd', x: 1 - (point.x + hs) / size, y: 1 - (point.z + hs) / size }
  }

  sidesBounds(){
    const sides = {}
    for( var i = 0; i < this.visible.points.length; i ++ ){
      let point = this.visible.points[i]
      const sideXY = this.pointSideXY(point)
      if(!sides[sideXY.side]) sides[sideXY.side] = { points: [], bounds: {x: {}, y: {}} }
      sides[sideXY.side].points.push({ x: sideXY.x, y: sideXY.y })
    }
    for(var side in sides){
      for(var i = 0; i < sides[side].points.length; i ++ ){
        let point = sides[side].points[i]
        if(!sides[side].bounds.x.min || sides[side].bounds.x.min > point.x) sides[side].bounds.x.min = point.x
        if(!sides[side].bounds.x.max || sides[side].bounds.x.max < point.x) sides[side].bounds.x.max = point.x
        if(!sides[side].bounds.y.min || sides[side].bounds.y.min > point.y) sides[side].bounds.y.min = point.y
        if(!sides[side].bounds.y.max || sides[side].bounds.y.max < point.y) sides[side].bounds.y.max = point.y
      }
    }
    return sides
  }

  screenPoints(max: number, size: number ){
    let screenPoints = []
    let points = []
    const min = -max
    const step = (max - min) / (size - 1)
    for(var x = min; x <= max; x += step){
      for(var y = min; y <= max; y += step){
        screenPoints.push(new Vector2( x, y ))
      }
    }
    const raycaster = new Raycaster()
    for(var i in screenPoints){
      raycaster.setFromCamera( screenPoints[i], this.camera );
      points.push(raycaster.intersectObject( this.cube )[0].point)
    }
    return points
  }

  sidesVisibleTiles(){
    this.visible.meshes = []
    const sides = ['f', 'b', 'u', 'd', 'l', 'r']
    for(var level in this.visible.pixels){
      const levelInt = parseInt(level)
      if(this.visible.pixels[level].visible){

        for(var side in this.visible.sides){
          if(!this.visible.sides[side].tiles){
            this.visible.sides[side].tiles = {}
          }
          this.visible.sides[side].tiles[level] = tilesFor(
            levelInt,
            this.levels[level],
            this.levels[level].fallback ? { x: { min: -1.1, max: 1.1 }, y: { min: -1.1, max: 1.1 } } : this.visible.sides[side].bounds
          )
          this.visible.meshes.push(level + '-' + side)
          this.visible.meshes = [...this.visible.meshes, ...this.visible.sides[side].tiles[level].map(item => level + '-' + side + '-' + item.x + '-' + item.y)]
        }

        if(this.levels[level].fallback){
          for(var i in sides){
            const side = sides[i]
            if(!this.visible.sides[side]){
              this.visible.sides[side] = { tiles: {} }
              this.visible.sides[side].tiles[level] = tilesFor(
                levelInt,
                this.levels[level],
                {x: { min: -1.1, max: 1.1 }, y: { min: -1.1, max: 1.1 } }
              )
              this.visible.meshes.push( level + '-' + side )
              this.visible.meshes = [...this.visible.meshes, ...this.visible.sides[side].tiles[level].map(item => level + '-' + side + '-' + item.x + '-' + item.y)]
            }
          }
        }
      }
    }
  }



  onCameraMove(e: Event){
    this.updatePosition()
  }

  onFovChanged(e: Event){
    this.updatePosition()
  }

  updatePosition(){
    const pos = this.controls.position()
    this.onPosFovChanged( pos )
    this.addUpdateVisible()
    if(this.camera.fov != pos.fov){
      this.camera.fov = pos.fov
      this.camera.updateProjectionMatrix()
    }
  }

  onPosFovChanged(pos: any){
    this.calcVisibleData(pos)
  }

  calcVisibleData(pos: any){
    const levels = this.levels.length
    let hasVisible = false
    let maxLevel = 0
    for(var i = 0; i < levels; i++){
      const item  = this.pixelsBySize(this.levels[i].size, pos.fov)
      if(this.levels[i].fallback) item.visible = true
      if(item.visible && !hasVisible) hasVisible = true
      if(item.visible && i > maxLevel) maxLevel = i
      this.visible.pixels[i] = item
    }
    const lastLevel = this.visible.pixels.length - 1
    if(
      lastLevel
      && !this.visible.pixels[lastLevel].visible
      && this.visible.pixels[lastLevel].number > this.pixelsMax
    ){
      this.visible.pixels[lastLevel].visible = true
    }
    this.visible.maxLevel = maxLevel
    if(!hasVisible){
      if(this.visible.pixels[0].number < this.pixelsMin) this.visible.pixels[0].visible = true
      if(this.visible.pixels[levels - 1].number > this.pixelsMax) this.visible.pixels[levels - 1].visible = true
    }
    this.visible.points = this.screenPoints(1.1, 5)
    this.visible.sides = this.sidesBounds()
    this.controls.fovMin = this.minFov(this.levels[lastLevel].size, 2)
    this.sidesVisibleTiles()
  }

  addUpdateVisible(){
    for(var side in this.visible.sides){
      for(var level in this.visible.sides[side].tiles){
        const tiles = this.visible.sides[side].tiles[level]
        const name = level + '-' + side
        const group = this.instance.getObjectByName(name)
        if(group){
          updateSide(group, side, level, tiles, this.source, this.visible.meshes)
        }else{
          this.instance.add(createSide(side, level, tiles, this.source))
        }
      }
    }
    const groups = this.instance.children.map(item => item.name)
    for(var i = groups.length - 1; i >= 0; i --){
      const name = groups[i]
      const [ level ] = name.split('-')
      if(
        !this.visible.meshes.includes(name)
        && !this.levels[level].fallback
      ){
        const group = this.instance.getObjectByName(name)
        if(group){
          deleteSide(group)
          this.instance.remove(group)
        }
      }
    }
    return this.instance
  }

}

export { Multires }
