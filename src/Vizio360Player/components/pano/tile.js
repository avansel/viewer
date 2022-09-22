
import { PlaneGeometry, Mesh, MeshBasicMaterial, DoubleSide, TextureLoader, Vector3 } from 'three';
import { tileBase, maxLevels } from '../../config.js'

function createTile(name, side, level, data, source) {
    const url = source()(side, level, data.x, data.y)
    const tileBaseSize = tileBase + maxLevels - level
    const half = tileBaseSize / 2
    const offsetX = data.width / 2 - half + data.offsetX
    const offsetY = half - data.height / 2 - data.offsetY
    const geometry = new PlaneGeometry(data.width, data.height)
    
    let material
    
    material = new MeshBasicMaterial({ map: new TextureLoader().load(url), depthWrite: true, transparent: true, opacity: 1});

    material.side = DoubleSide
    const tile = new Mesh(geometry, material)
    tile.name = name
    tile.position.set(offsetX, offsetY, 0)
    return tile;
}

export { createTile };