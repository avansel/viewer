import { describe, expect, it } from 'vitest'
import { latLngToPos, normLng, tilesFor } from './utils'

describe('utils', () => {
  it('converts lat/lng to 3D position on radius 50 sphere', () => {
    const pos = latLngToPos(0, 0)

    expect(pos.x).toBeCloseTo(50, 6)
    expect(pos.y).toBeCloseTo(0, 6)
    expect(pos.z).toBeCloseTo(0, 6)
  })

  it('normalizes longitude to [0, 360]', () => {
    expect(normLng(725)).toBe(5)
    expect(normLng(-10)).toBe(350)
  })

  it('returns visible tiles for multires bounds', () => {
    const tiles = tilesFor(
      16,
      { tileSize: 512, size: 952 },
      {
        x: { min: 0.9, max: 0.9 },
        y: { min: 0.9, max: 0.9 },
      }
    )

    expect(tiles.length).toBe(4)
    expect(tiles[0]).toMatchObject({ x: 0, y: 0, offsetX: 0, offsetY: 0 })
    expect(tiles[3].width).toBeCloseTo(46.218, 3)
    expect(tiles[3].height).toBeCloseTo(46.218, 3)
  })
})
