
import { BoxGeometry, CanvasTexture, Mesh, MeshBasicMaterial, BackSide, ImageLoader } from 'three';
import { pano } from '../../../config.json'

enum ImageType { Sphere, Cylinder, Cubestrip }
enum StripType { Type1x6, Type2x3, Type3x2, Type6x1 }

interface PreviewSettings {
    type?: ImageType,
    stripType?: StripType
    url?: string,
    striporder?: string,
    size: number
}

const striporderDefault = 'rludfb'

let preview: Mesh
let settings: PreviewSettings
let contexts: Array<CanvasRenderingContext2D> = []
let materials: Array<MeshBasicMaterial> = []

/*
let size, sides = {}
let positions
const format = 'udlrfb'
*/

const colorSide = (side: string) => {
    return {
        u: '#8888aa',
        d: '#88aa88',
        l: '#aa8888',
        r: '#88aaaa',
        f: '#aaaa88',
        b: '#aaaaaa',
    }[side]
}

const getSides = () => {
    const striporder = settings.striporder ?? striporderDefault
    return Array.from(striporder)
}

const getCanvas = (side: string) => {
    const canvas = document.createElement( 'canvas' )
    const size = settings.size ?? 1024
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext("2d")
    context.fillStyle = colorSide(side)
    context.fillRect(0, 0, size, size)
    context.rect(20, 20, size - 40, size - 40)
    context.strokeStyle = "#ffffff";
    context.stroke();
    context.fillStyle = "#ffffff"
    context.font = "48px Arial";
    context.textAlign = "center"
    context.fillText('side: ' + side, size / 2, size / 2)
    return canvas
}

const getMaterial = (canvas: HTMLCanvasElement) => {
    const texture = new CanvasTexture(canvas)
    const material = new MeshBasicMaterial( { map: texture, depthWrite: true } )
    material.side = BackSide
    material.opacity = 1
    material.transparent = true
    return material
}

const materialsEmpty = () => {
    const materials = []
    const sides = getSides()
    for(var i = 0; i < sides.length; i ++){
        const side = sides[i]
        const canvas = getCanvas(side)
        contexts.push(canvas.getContext('2d'))
        materials.push(getMaterial(canvas))
    }
    return materials
}

const settingsBy = (img: HTMLImageElement): PreviewSettings => {
    const width = img.width
    const height = img.height

    if(height / width == 6){
        if(!settings.type) settings.type = ImageType.Cubestrip
        if(!settings.stripType) settings.stripType = StripType.Type1x6
        if(!settings.size) settings.size = width
    }else if(height / width == 1.5){
        if(!settings.type) settings.type = ImageType.Cubestrip
        if(!settings.stripType) settings.stripType = StripType.Type2x3
        if(!settings.size) settings.size = width / 2
    }else if(width / height == 1.5){
        if(!settings.type) settings.type = ImageType.Cubestrip
        if(!settings.stripType) settings.stripType = StripType.Type3x2
        if(!settings.size) settings.size = height / 2
    }else if(width / height == 6){
        if(!settings.type) settings.type = ImageType.Cubestrip
        if(!settings.stripType) settings.stripType = StripType.Type6x1
        if(!settings.size) settings.size = height
    }else if(width / height == 2){
        if(!settings.type) settings.type = ImageType.Sphere
    }
    if(!settings.type) settings.type = ImageType.Cylinder
    if(!settings.size) settings.size = pano.tileBase
    return settings
}

const onImageLoad = (img: HTMLImageElement) => {
    const sides = Array.from(striporderDefault)
    const materials = []
    const size = settings.size
    settings = settingsBy(img)
    for(var i = 0; i < sides.length; i ++){
        const side = sides[i]
        const index = settings.striporder.indexOf(sides[i])
        const canvas = getCanvas(side)
        const context = canvas.getContext('2d')
        context.drawImage( img, 0, size * index, size, size, 0, 0, size, size )
        materials.push(getMaterial(canvas))
    }
    return materials
}

const onError = (e: ErrorEvent) => {
    console.log(e)
}

const load = async (src: string): Promise<HTMLImageElement> => {
    const loader = new ImageLoader()
    return new Promise<HTMLImageElement>((resolve, reject) => {
        loader.load(src, img => resolve(img), undefined, e => reject(e))
    })
}

async function createPreview(data: PreviewSettings): Promise<Mesh> {
    settings = data

    return new Promise<Mesh>((resolve, reject) => {
        const boxSize = pano.tileBase + pano.maxLevels + 1
        const geometry = new BoxGeometry(boxSize, boxSize, boxSize)

        if(settings.url || settings.type){

            if(!settings.type){
                load('/tiles/preview.jpg').then(img => {
                    materials = onImageLoad(img)
                    preview = new Mesh(geometry, materials);
                    preview.scale.x = -1
                    preview.renderOrder = 1
                    resolve(preview)    
                })
            }

        }else{
            materials = materialsEmpty()
            preview = new Mesh(geometry, materials);
            preview.scale.x = -1
            preview.renderOrder = 1
            resolve(preview)
        }
    })

}

export { createPreview };