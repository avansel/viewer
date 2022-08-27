
import { MathUtils } from "three"

let isUserInteracting = false,
onPointerDownMouseX = 0, onPointerDownMouseY = 0,
lon = 90, onPointerDownLon = 0,
lat = 0, onPointerDownLat = 0,
phi = 0, theta = 0;

class PanoControls {

    constructor(camera, canvas) {
        this.camera = camera;
        this.canvas = canvas
        this.init()
    }

    tick(delta) {
        if ( isUserInteracting === false ) {
            lon += 0.025;
        }

        lat = Math.max( - 89.5, Math.min( 89.5, lat ) );
        phi = MathUtils.degToRad( 90 - lat );
        theta = MathUtils.degToRad( lon );
  
        const x = 500 * Math.sin( phi ) * Math.cos( theta );
        const y = 500 * Math.cos( phi );
        const z = 500 * Math.sin( phi ) * Math.sin( theta );

        this.camera.lookAt(x, y, z);
    }

    init(){
        
        const onPointerDown = e => {
            if ( e.isPrimary === false ) return;    
            isUserInteracting = true;    
            onPointerDownMouseX = e.clientX;
            onPointerDownMouseY = e.clientY;
        
            onPointerDownLon = lon;
            onPointerDownLat = lat;
        
            document.addEventListener( 'pointermove', _onPointerMove );
            document.addEventListener( 'pointerup', onPointerUp );
        }
        
        const _onPointerMove = e => ((e, camera) => {
            if ( e.isPrimary === false ) return;
            lon = ( onPointerDownMouseX - e.clientX ) * camera.fov / 650 + onPointerDownLon;
            lat = ( e.clientY - onPointerDownMouseY ) * camera.fov / 650 + onPointerDownLat;
        })(e, this.camera)
        
        const onPointerUp = (e) => {
            if ( e.isPrimary === false ) return;
            isUserInteracting = false;
            document.removeEventListener( 'pointermove', _onPointerMove );
            document.removeEventListener( 'pointerup', onPointerUp );
        }
        
        const onDocumentMouseWheel = (e, camera) => {
            const fov = camera.fov + e.deltaY * camera.fov / 1000;
            camera.fov = MathUtils.clamp( fov, 0.1, 155 );
            camera.updateProjectionMatrix();
        }

        this.canvas.addEventListener( 'pointerdown', onPointerDown );
        document.addEventListener( 'wheel', e => onDocumentMouseWheel(e, this.camera) );
    }

}

export { PanoControls }