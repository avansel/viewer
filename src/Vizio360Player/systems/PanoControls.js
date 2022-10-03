
import { MathUtils } from "three"
import { normLng } from '../components/utils.ts'


let isUserInteracting = false,
onPointerDownMouseX = 0, onPointerDownMouseY = 0,
lng = 90, lngVector = 90, onPointerDownLng = 0,
lat = 0, latVector = 0, onPointerDownLat = 0,
phi = 0, theta = 0,
fov = 70, fovVector = 70

class PanoControls {

    constructor(camera, canvas, shouldTween) {
        this.camera = camera;
        this.canvas = canvas
        this.shouldTween = !!shouldTween
        this.init()
    }

    getPosition(){
        return { lat, lng: normLng(lng), fov }
    }

    lookAt(lat, lng){
        lat = Math.max( - 90, Math.min( 89.9999999999, lat ) );
        phi = MathUtils.degToRad( 90 - lat );
        theta = MathUtils.degToRad( lng );
  
        const x = 500 * Math.sin( phi ) * Math.cos( theta );
        const y = 500 * Math.cos( phi );
        const z = 500 * Math.sin( phi ) * Math.sin( theta );
        this.camera.lookAt(x, y, z);
    }

    tick(delta) {
        if ( isUserInteracting === false ) {
            //lng += 0.025;
        }
        lat = Math.max( - 90, Math.min( 89.9999999999, lat ) );
        if(this.shouldTween){
            if(fovVector != fov){
                let diff = (fov - fovVector) / 10
                if(Math.abs(fovVector / diff) > 500000){
                    fov = fovVector
                }else{
                    fov = fov - diff
                }
                this.canvas.dispatchEvent(new CustomEvent('onFovChanged', {detail: { fov }}))
            }
            let posChanged = false
            if(latVector != lat){
                let diff = (lat - latVector) / 10
                if(Math.abs(fov / diff) > 100000){
                    lat = latVector
                }else{
                    lat = lat - diff
                }
                posChanged = true
            }
            if(lngVector != lng){
                let diff = (lng - lngVector) / 10
                if(Math.abs(fov / diff) > 100000){
                    lng = lngVector
                }else{
                    lng = lng - diff
                }
                posChanged = true
            }
            if(posChanged){
                this.lookAt(lat, lng)
                this.canvas.dispatchEvent(new CustomEvent('onCameraMove', {detail: { lat, lng, fov }}))
            }
        }
    }

    init(){

        this.canvas.addEventListener( 'click', e => {
            this.canvas.dispatchEvent(new CustomEvent('onPanoClick', {detail: e}))
        })

        const onPointerDown = e => {
            if ( e.isPrimary === false ) return;    
            isUserInteracting = true;    
            onPointerDownMouseX = e.clientX;
            onPointerDownMouseY = e.clientY;
        
            onPointerDownLng = lng;
            onPointerDownLat = lat;
        
            document.addEventListener( 'pointermove', _onPointerMove );
            document.addEventListener( 'pointerup', onPointerUp );
        }
        
        const _onPointerMove = e => ((e, camera, canvas) => {
            if ( e.isPrimary === false ) return;
            if(this.shouldTween){
                lngVector = ( onPointerDownMouseX - e.clientX ) * camera.fov / 650 + onPointerDownLng;
                latVector = ( e.clientY - onPointerDownMouseY ) * camera.fov / 650 + onPointerDownLat;
            }else{
                lng = ( onPointerDownMouseX - e.clientX ) * camera.fov / 650 + onPointerDownLng;
                lat = ( e.clientY - onPointerDownMouseY ) * camera.fov / 650 + onPointerDownLat;
                this.lookAt(lat, lng)
                canvas.dispatchEvent(new CustomEvent('onCameraMove', {detail: { lat, lng }}))
            }
        })(e, this.camera, this.canvas)
        
        const onPointerUp = (e) => {
            if ( e.isPrimary === false ) return;
            isUserInteracting = false;
            document.removeEventListener( 'pointermove', _onPointerMove );
            document.removeEventListener( 'pointerup', onPointerUp );
        }
        
        const onDocumentMouseWheel = (e, camera, canvas) => {
            if(this.shouldTween){
                fovVector = MathUtils.clamp(fovVector + e.deltaY * fovVector / 1000, 0.0055, 160 )
            }else{
                fov = MathUtils.clamp(fov + e.deltaY * fov / 1000, 0.0055, 160 )
                canvas.dispatchEvent(new CustomEvent('onFovChanged', {detail: { fov }}))
            }
        }

        this.canvas.addEventListener( 'pointerdown', onPointerDown )
        document.addEventListener( 'wheel', e => onDocumentMouseWheel(e, this.camera, this.canvas) )

        this.lookAt(lat, lng)
    }

}

export { PanoControls }