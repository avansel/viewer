
import { MathUtils } from "three"
import { normLng } from '../components/utils.ts'


let isUserInteracting = false,
onTouchDist, onTouchFov, touchType,
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
        this.fovMax = 160;
        this.fovMin = 0.0055;
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

        // touch events

        const onTouchStart = e => {

            console.log('onTouchStart')

            var touches = e.touches
            if(touches.length == 1){
                touchType = 'touch'
            }else if(touches.length == 2){
                touchType = 'zoom'
            }

            if(touchType == 'touch' && e.type == 'touchstart'){
                var touch = touches[0]
                isUserInteracting = true
                onPointerDownMouseX = touch.pageX
                onPointerDownMouseY = touch.pageY
                onPointerDownLng = lng
                onPointerDownLat = lat
            }

            if(touchType == 'zoom'){
                onTouchDist = Math.hypot(
                    touches[0].pageX - touches[1].pageX,
                    touches[0].pageY - touches[1].pageY
                )
                onTouchFov = fov
            }

            document.addEventListener( 'touchmove', onTouchMove )
            document.addEventListener( 'touchend', onTouchUp )
            document.addEventListener( 'touchcancel', onTouchUp )
            e.preventDefault()
        }

        this.canvas.addEventListener('touchstart', onTouchStart)

        const onTouchMove = e => ((e, camera, canvas) => {

            var touches = e.touches
            var newTouchType
            if(touches.length == 1){
                newTouchType = 'touch'
            }else if(touches.length == 2){
                newTouchType = 'zoom'
            }
            console.log(touchType, newTouchType)
            if(touchType != newTouchType){
                return null
            }

            if(touchType == 'touch' && e.type == 'touchmove'){
                var touch = touches[0]
                lng = ( onPointerDownMouseX - touch.pageX ) * camera.fov / 650 + onPointerDownLng;
                lat = ( touch.pageY - onPointerDownMouseY ) * camera.fov / 650 + onPointerDownLat;
                latVector = lat
                lngVector = lng
                this.lookAt(lat, lng)
                canvas.dispatchEvent(new CustomEvent('onCameraMove', {detail: { lat, lng }}))
            }

            if(touchType == 'zoom' && e.type == 'touchmove'){
                var dist = Math.hypot(
                    touches[0].pageX - touches[1].pageX,
                    touches[0].pageY - touches[1].pageY
                )
                var diff = onTouchDist - dist
                fov = MathUtils.clamp( onTouchFov + diff * onTouchFov / 500, this.fovMin, this.fovMax )
                fovVector = fov
                canvas.dispatchEvent(new CustomEvent('onFovChanged', {detail: { fov }}))
            }

        })(e, this.camera, this.canvas)

        const onTouchUp = (e) => {
            if ( e.isPrimary === false ) return;
            isUserInteracting = false;
            document.removeEventListener( 'pointermove', onTouchMove );
            document.removeEventListener( 'pointerup', onTouchUp );
            touchType = null
        }

        // mouse events

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

            //console.log('onPointerDown', e)

            document.addEventListener( 'pointermove', onPointerMove );
            document.addEventListener( 'pointerup', onPointerUp );
        }

        this.canvas.addEventListener( 'pointerdown', onPointerDown )

        const onPointerMove = e => ((e, camera, canvas) => {
            if ( e.isPrimary === false ) return;
            if(e.pointerType == 'mouse'){
                if(this.shouldTween){
                    lngVector = ( onPointerDownMouseX - e.clientX ) * camera.fov / 650 + onPointerDownLng;
                    latVector = ( e.clientY - onPointerDownMouseY ) * camera.fov / 650 + onPointerDownLat;
                }else{
                    lng = ( onPointerDownMouseX - e.clientX ) * camera.fov / 650 + onPointerDownLng;
                    lat = ( e.clientY - onPointerDownMouseY ) * camera.fov / 650 + onPointerDownLat;
                    this.lookAt(lat, lng)
                    canvas.dispatchEvent(new CustomEvent('onCameraMove', {detail: { lat, lng }}))
                }
            }
        })(e, this.camera, this.canvas)
        
        const onPointerUp = (e) => {
            if ( e.isPrimary === false ) return;
            isUserInteracting = false;
            document.removeEventListener( 'pointermove', onPointerMove );
            document.removeEventListener( 'pointerup', onPointerUp );
        }
        
        const onDocumentMouseWheel = (e, camera, canvas) => {
            if(this.shouldTween){
                fovVector = MathUtils.clamp(fovVector + e.deltaY * fovVector / 1000, this.fovMin, this.fovMax )
            }else{
                fov = MathUtils.clamp(fov + e.deltaY * fov / 1000, this.fovMin, this.fovMax )
                canvas.dispatchEvent(new CustomEvent('onFovChanged', {detail: { fov }}))
            }
        }

        document.addEventListener( 'wheel', e => onDocumentMouseWheel(e, this.camera, this.canvas) )

        this.lookAt(lat, lng)
    }

}

export { PanoControls }