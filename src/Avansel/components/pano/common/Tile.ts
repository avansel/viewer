
import { PlaneGeometry, Mesh, MeshBasicMaterial, DoubleSide, ImageLoader, Texture, Loader, Material } from 'three';
import { pano } from '../../../config.json'
import { AbortFunction } from '../../../Types';

class TextureLoader extends Loader{

	constructor( manager?: any ) {
		super( manager );
	}

	load( url: string, onLoad?: Function, onProgress?: (event: ProgressEvent<EventTarget>) => void | null, onError?: (event: ErrorEvent) => void | null ): Texture {
		const texture = new Texture() as Texture & AbortFunction;
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

function createTile(name: string, side: string, level: number, data: any, source: string | Function) {
    const url = typeof source == 'function' ? source()(side, level, data.x, data.y) : source
    const tileBaseSize = pano.tileBase + pano.maxLevels - level
    const half = tileBaseSize / 2
    const offsetX = data.width / 2 - half + data.offsetX
    const offsetY = half - data.height / 2 - data.offsetY
    const geometry = new PlaneGeometry(data.width, data.height)
    
    let material: Material
    material = new MeshBasicMaterial({ map: new TextureLoader().load(url), depthWrite: true, transparent: true, opacity: 1});
    material.side = DoubleSide
    const tile = new Mesh(geometry, material)
    tile.name = name
    tile.position.set(offsetX, offsetY, 0)
    return tile;
}

export { createTile };