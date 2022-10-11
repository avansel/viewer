
import { Group, Material, MathUtils, Mesh, MeshBasicMaterial, Texture } from 'three';
import { createTile } from './Tile';
import { pano } from '../../../config.json'
import { AbortFunction } from '../../../Types';

const sidePosition = (side: string, level: number) => {
    const tileBaseSize = pano.tileBase + pano.maxLevels - level
    const half = tileBaseSize / 2
    if(side == 'f') return [ 0, 0, half ]
    if(side == 'b') return [ 0, 0, -half ]
    if(side == 'l') return [ half, 0, 0 ]
    if(side == 'r') return [ -half,  0, 0 ]
    if(side == 'u') return [ 0, half, 0 ]
    if(side == 'd') return [ 0, -half, 0 ]
    return [0, 0, 0]
}

const sideRotation = (side: string) => {
    if(side =='f') return [0, MathUtils.degToRad(180), 0]
    if(side =='b') return [0, MathUtils.degToRad(0), 0]
    if(side =='l') return [0, MathUtils.degToRad(-90), 0]
    if(side =='r') return [0, MathUtils.degToRad(90), 0]
    if(side =='d') return [MathUtils.degToRad(90), MathUtils.degToRad(180), 0]
    if(side =='u') return [MathUtils.degToRad(-90), MathUtils.degToRad(180), 0]
    return [0, 0, 0]
}

const sideByLatLng = (lat: number, lng: number) => {
    if(lng > 45 && lng <= 135 && lat >= -45 && lat <= 45) return 'f'
    if(lng > 135 && lng <= 225 && lat >= -45 && lat <= 45) return 'r'
    if(lng > 225 && lng <= 315 && lat >= -45 && lat <= 45) return 'b'
    if(((lng > 315 && lng <= 360) || (lng >=0 && lng <= 45)) && lat >= -45 && lat <= 45) return 'l'
    if(lat > 45) return 'u'
    if(lat < -45) return 'd'
}

function createSide(side: string, level: number, tiles: Array<any>, source: string | Function) {
    const group = new Group()
    const position = sidePosition(side, level)
    const rotation = sideRotation(side)
    group.position.set(position[0], position[1], position[2] );
    group.rotation.set(rotation[0], rotation[1], rotation[2] );
    group.renderOrder = level + 1
    group.name = level + '-' + side
    for(var i = 0; i < tiles.length; i++){
        const data = tiles[i]
        const name = level + '-' + side + '-' + data.x + '-' + data.y
        group.add(createTile(name, side, level, data, source))
    }
    return group
}

function updateSide(group: Group, side: string, level: number, tiles: Array<any>, source: string | Function, meshes: Array<string>) {
    for(var i = 0; i < tiles.length; i++){
        const data = tiles[i]
        const name = level + '-' + side + '-' + data.x + '-' + data.y
        if(!group.getObjectByName(name)){
            group.add(createTile(name, side, level, data, source))
        }
    }
    for(var i = group.children.length - 1; i >= 0; i--){
        if(!meshes.includes(group.children[i].name)){
            const tile = group.children[i] as Mesh
            const material = tile.material as MeshBasicMaterial
            const texture  = material.map as Texture & AbortFunction
            texture.abort()
            tile.geometry.dispose()
            material.dispose()
            group.remove( tile );
        }
    }
}

function deleteSide(group) {
    for(var i = group.children.length - 1; i >= 0; i--){
        const tile = group.children[i]
        tile.material.map.abort()
        tile.geometry.dispose()
        tile.material.dispose()
        group.remove( tile );
    }
}

export { createSide, updateSide, deleteSide };