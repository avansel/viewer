import { Group, Mesh, Scene as ThreeScene } from 'three';

export default class Scene{
  instance: ThreeScene

  constructor(){
    this.instance = new ThreeScene();
  }

  add(object: Mesh|Group){
    this.instance.add(object)
  }

  get(){
    return this.instance
  }

}
