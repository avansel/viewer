
import { PlaneGeometry, Mesh, MeshBasicMaterial, DoubleSide, ImageLoader, Texture, Loader } from 'three';
import { pano } from '../../config.json'

class TextureLoader extends Loader {

	constructor( manager ) {
		super( manager );
	}

	load( url, onLoad, onProgress, onError ) {
		const texture = new Texture();
		const loader = new ImageLoader( this.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.setPath( this.path );
		var image = loader.load( url, function ( image ) {
			texture.image = image;
			texture.needsUpdate = true;
			if ( onLoad !== undefined ) {
				onLoad( texture );
			}
		}, onProgress, onError )

        texture.abort = () => {
            if(image && typeof image.hasAttribute === 'function'){
                image.src = '';
            }
        }

        return texture;
	}
}

function createTile(name, side, level, data, source) {
    const url = source()(side, level, data.x, data.y)
    const tileBaseSize = pano.tileBase + pano.maxLevels - level
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