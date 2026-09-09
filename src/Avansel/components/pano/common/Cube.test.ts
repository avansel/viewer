import { describe, expect, it } from 'vitest'
import { BackSide } from 'three'
import { createCube } from './Cube'

describe('createCube', () => {
  it('creates inverted cube mesh for panorama projection', () => {
    const cube = createCube()

    expect(cube.name).toBe('')
    expect(cube.material.side).toBe(BackSide)
    expect(cube.material.transparent).toBe(true)
  })
})
