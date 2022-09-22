import { Group, Mesh, Vector2, Raycaster, PerspectiveCamera, Vector3 } from 'three';
import { createSide, updateSide, deleteSide } from './side.js';
import { normLat, normLng, tilesFor } from '../utils'
import { tileBase, maxLevels } from '../../config.js'

class MultiResPano {

  levels: Array<any>;
  source: Function | string;
  controls: any;
  pano: Group;
  pos: Object;
  fov: number;
  visible: any;
  pixelsMin: number;
  pixelsMax: number;

  constructor(levels: Array<any>, source: Function | string, controls: any) {
    this.pixelsMin = 0.5
    this.pixelsMax = 5
    this.levels = levels;
    this.source = source;
    this.controls = controls
    this.visible = {
      pixels: {},
      maxLevel: 0,
      sides: {},
      meshes: []
    }
  }

  createPano(){
    this.pano = new Group();
    //for(var i = 0; i < sides.length; i++) this.pano.add(createSide(sides[i], this.levels, this.source))
    this.pano.renderOrder = 2
    this.pano.name = 'multires-pano'
    return this.pano;
  }

  pixelsBySize(size: number){
    const height = this.controls.canvas.height
    const number = height / (0.9 * this.fov * size / 100)
    return {
        number,
        visible: number >= this.pixelsMin && number <= this.pixelsMax
    }
  }

  pointSideXY(point: Vector3){
    const size = ( maxLevels + tileBase + 1 )
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

  screenPoints(max: number, size: number, obj: Mesh, camera: PerspectiveCamera ){
    let screenPoints = []
    let points = []
    const min = -max
    const step = (max - min) / (size - 1)
    for(var x = min; x <= max; x += step){
      for(var y = min; y <= max; y += step){
        screenPoints.push(new Vector2(  x,  y ))
      }
    }
    const raycaster = new Raycaster()
    for(var i in screenPoints){
      raycaster.setFromCamera( screenPoints[i], camera );
      points.push(raycaster.intersectObject( obj )[0].point)
    }
    return points
  }

  sidesVisibleTiles(obj: Mesh, camera: PerspectiveCamera){
    this.visible.meshes = []
    for(var side in this.visible.sides){
      this.visible.sides[side].tiles = {}
      for(var level in this.visible.pixels){
        if(this.visible.pixels[level].visible){
          this.visible.sides[side].tiles[level] = tilesFor(
            parseInt(level),
            this.levels[level],
            this.visible.sides[side].bounds
          )
          this.visible.meshes.push(level + '-' + side)
          this.visible.meshes = [...this.visible.meshes, ...this.visible.sides[side].tiles[level].map(item => level + '-' + side + '-' + item.x + '-' + item.y)]
        }
      }
    }
  }

  onPosFovChanged(pos: any, fov: number, obj: Mesh, camera: PerspectiveCamera){
    this.fov = fov
    const levels = this.levels.length
    let hasVisible = false
    let maxLevel = 0
    for(var i = 0; i < levels; i++){
      const item  = this.pixelsBySize(this.levels[i].size)
      if(this.levels[i].fallback) item.visible = true
      if(item.visible && !hasVisible) hasVisible = true
      if(item.visible && i > maxLevel) maxLevel = i
      this.visible.pixels[i] = item
    }
    this.visible.maxLevel = maxLevel
    if(!hasVisible){
      if(this.visible.pixels[0].number < this.pixelsMin) this.visible.pixels[0].visible = true
      if(this.visible.pixels[levels - 1].number > this.pixelsMax) this.visible.pixels[levels - 1].visible = true
    }

    this.visible.points = this.screenPoints(1.1, 5, obj, camera)
    this.visible.sides = this.sidesBounds()
    this.sidesVisibleTiles(obj, camera)
  }

  addUpdateVisible(){
    for(var side in this.visible.sides){
      for(var level in this.visible.sides[side].tiles){
        const tiles = this.visible.sides[side].tiles[level]
        const name = level + '-' + side
        const group = this.pano.getObjectByName(name)
        if(group){
          updateSide(group, side, level, tiles, this.source, this.visible.meshes)
        }else{
          this.pano.add(createSide(side, level, tiles, this.source))
        }
      }
    }
    const groups = this.pano.children.map(item => item.name)
    for(var i = groups.length - 1; i >= 0; i --){
      const name = groups[i]
      const [ level ] = name.split('-')
      if(
        !this.visible.meshes.includes(name)
        && !this.levels[level].fallback
      ){
        const group = this.pano.getObjectByName(name)
        if(group){
          deleteSide(group)
          this.pano.remove(group)
        }
      }
    }
    return this.pano
  }
}


export { MultiResPano };