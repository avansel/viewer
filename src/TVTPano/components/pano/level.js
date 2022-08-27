
import { Group } from 'three';
import { createSide } from './side.js';

function createLevel(level, data, source) {

    const sides = ['f', 'b', 'l', 'r', 'u', 'd']

    const obj = new Group();
    for(var i = 0; i < sides.length; i++) obj.add(createSide(sides[i], level, data, source))

    return obj;

}

export { createLevel };