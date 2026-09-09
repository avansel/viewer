import { describe, expect, it } from 'vitest'
import { Mesh, SphereGeometry, MeshBasicMaterial } from 'three'
import Scene from './Scene'

describe('Scene', () => {
  it('adds objects to internal three.js scene', () => {
    const scene = new Scene()
    const object = new Mesh(new SphereGeometry(1, 8, 8), new MeshBasicMaterial())

    scene.add(object)

    expect(scene.get().children).toContain(object)
  })
})
