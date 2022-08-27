
import { PlaneGeometry, Mesh, MeshStandardMaterial, DoubleSide, TextureLoader, Vector3 } from 'three';
import { tileBase, maxLevels } from '../../config.js'

function createTile(side, level, data, source) {
    const url = source()(side, level, data.x, data.y)
    const tileBaseSize = tileBase + maxLevels - level
    const half = tileBaseSize / 2
    const offsetX = data.width / 2 - half + data.offsetX
    const offsetY = half - data.height / 2 - data.offsetY

    const geometry = new PlaneGeometry(data.width, data.height)
    
    let material
    
    if(level < 7){
        material = new MeshStandardMaterial({ map: new TextureLoader().load(url)});
    }else{
        material = new MeshStandardMaterial({ color: 'black', transparent: true, opacity: 0.0 });
    }

    material.side = DoubleSide
    const tile = new Mesh(geometry, material);
    tile.position.set(offsetX, offsetY, 0);

    return tile;
}

export { createTile };