
import { Group, MathUtils } from 'three';
import { createTile } from './tile.js';
import { tileBase, maxLevels } from '../../config.js'

const tilesFor = (level, levelData) => {
    const { tileSize, size } = levelData
    const tileBaseSize = tileBase + maxLevels - level
    const tileSizePercent = tileSize / (size / tileBaseSize)
    const tiles = [];
    for(var x = 0; (x * tileSizePercent) < tileBaseSize; x ++){
        for(var y = 0; (y * tileSizePercent) < tileBaseSize; y ++){
            tiles.push({
                x: x,
                y: y,
                offsetX: x * tileSizePercent,
                offsetY: y * tileSizePercent,
                width: ((x + 1) * tileSizePercent) > tileBaseSize ? (tileBaseSize - x * tileSizePercent) : tileSizePercent,
                height: ((y + 1) * tileSizePercent) > tileBaseSize ? (tileBaseSize - y * tileSizePercent) : tileSizePercent
            })
        }
    }
    return tiles
}

const sidePosition = (side, level) => {
    const tileBaseSize = tileBase + maxLevels - level
    const half = tileBaseSize / 2
    if(side == 'f') return [ 0, 0, half ]
    if(side == 'b') return [ 0, 0, -half ]
    if(side == 'l') return [ half, 0, 0 ]
    if(side == 'r') return [ -half,  0, 0 ]
    if(side == 'u') return [ 0, half, 0 ]
    if(side == 'd') return [ 0, -half, 0 ]
    return [0, 0, 0]
}

const sideRotation = side => {
    if(side =='f') return [0, MathUtils.degToRad(180), 0]
    if(side =='b') return [0, MathUtils.degToRad(0), 0]
    if(side =='l') return [0, MathUtils.degToRad(-90), 0]
    if(side =='r') return [0, MathUtils.degToRad(90), 0]
    if(side =='d') return [MathUtils.degToRad(90), MathUtils.degToRad(180), 0]
    if(side =='u') return [MathUtils.degToRad(-90), MathUtils.degToRad(180), 0]
    return [0, 0, 0]
}

function createSide(side, level, levelData, source) {
    const obj = new Group()
    const tiles = tilesFor(level, levelData)
    
    for(var i = 0; i < tiles.length; i ++){
        obj.add(createTile(side, level, tiles[i], source))
    }
    const position = sidePosition(side, level)
    const rotation = sideRotation(side)
    obj.position.set(position[0], position[1], position[2] );
    obj.rotation.set(rotation[0], rotation[1], rotation[2] );

    return obj;
}

export { createSide };