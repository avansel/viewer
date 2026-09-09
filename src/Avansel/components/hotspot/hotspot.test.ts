import { describe, expect, it } from 'vitest'
import { createHotspot, createHotspotXYZ } from './hotspot'

describe('hotspot', () => {
  it('creates hotspot by spherical coordinates', () => {
    const hotspot = createHotspot(0, 0)

    expect(hotspot.position.x).toBeCloseTo(50, 6)
    expect(hotspot.position.y).toBeCloseTo(0, 6)
    expect(hotspot.position.z).toBeCloseTo(0, 6)
  })

  it('creates hotspot by explicit xyz coordinates', () => {
    const hotspot = createHotspotXYZ(1, 2, 3)

    expect(hotspot.position.x).toBe(1)
    expect(hotspot.position.y).toBe(2)
    expect(hotspot.position.z).toBe(3)
  })
})
