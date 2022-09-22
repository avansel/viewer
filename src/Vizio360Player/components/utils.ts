import { MathUtils } from 'three';
import { tileBase, maxLevels } from '../config.js';

interface AxisBounds {
    min: number,
    max: number
}

interface SideBounds {
    x: AxisBounds,
    y: AxisBounds
}

interface Position {
    x: number,
    y: number,
    z: number
}

interface Level {
    size: number,
    tileSize: number
}

interface TileInfo {
    x: number,
    y: number,
    offsetX: number,
    offsetY: number,
    width: number,
    height: number
}

export const sides = [ 'f', 'b', 'l', 'r', 'u', 'd' ]

export const latLngToPos = (lat:number, lng: number): Position => {
    const phi = MathUtils.degToRad( 90 - lat );
    const theta = MathUtils.degToRad( lng );
    const radius = 50;
    let pos: Position = { x: 0, y: 0, z: 0 }
    pos.x = radius * Math.sin( phi ) * Math.cos( theta );
    pos.y = radius * Math.cos( phi );
    pos.z = radius * Math.sin( phi ) * Math.sin( theta );
    return pos
}

const minFor = (value: number, count: number, extend: number) => {
    value = Math.round(value * count) - extend
    if(value < 0) value = 0
    return value
}

const maxFor = (value: number, count: number, extend: number) => {
    value = Math.round(value * count) + extend
    if(value > (count - 1)) value = count - 1
    return value
}

export const tilesFor = (level: number, levelData: Level, bounds: SideBounds):Array<TileInfo> => {
    if(!bounds?.x?.min && !bounds?.x?.max) return []
    const { tileSize, size } = levelData
    const tileBaseSize = tileBase + maxLevels - level
    const tileSizePart = tileSize / (size / tileBaseSize)
    const tiles = [];
    const max = Math.round(tileBaseSize / tileSizePart)
    let xMin = minFor(bounds.x.min, max, 2)
    let xMax = maxFor(bounds.x.max, max, 2)
    let yMin = minFor(bounds.y.min, max, 2)
    let yMax = maxFor(bounds.y.max, max, 2)
    for(var x = xMin; x <= xMax; x ++){
        for(var y = yMin; y <= yMax; y ++){
            if( x >= xMin && x <= xMax && y >= yMin && y <= yMax ){
                const offsetX = x * tileSizePart
                const offsetY = y * tileSizePart
                const width = ((x + 1) * tileSizePart) > tileBaseSize ? (tileBaseSize - x * tileSizePart) : tileSizePart
                const height = ((y + 1) * tileSizePart) > tileBaseSize ? (tileBaseSize - y * tileSizePart) : tileSizePart    
                tiles.push({ x, y, offsetX, offsetY, width, height })
            }
        }
    }
    return tiles
}

export const normLng = (lng: number): number => {
    while(lng > 360) lng -= 360
    while(lng < 0) lng += 360
    return lng
}

export const normLat = (lat: number): number => {
    if(lat > 90) lat = lat - (90 - lat)
    if(lat < -90) lat = lat + (lat - 90)
    return lat
}