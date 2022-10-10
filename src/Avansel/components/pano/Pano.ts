import Sphere from './Sphere'
import { Multires } from './Multires'
import { Group, Mesh } from 'three'
import Controls from '../../systems/Controls'

export default class Pano{

    instance: Sphere|Multires

    constructor(){}

    sphere(source: string, controls: Controls){
        this.instance = new Sphere(source, controls)
        return this
    }

    multires(levels: Array<Object>, source: Function|string, controls: Controls){
        this.instance = new Multires(levels, source, controls)
        this.instance.createPano()
        this.instance.updatePosition()
        return this
    }

    get(): Mesh|Group {
        return this.instance.get()
    }

}
