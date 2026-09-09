import { describe, expect, it, vi } from 'vitest'
import Camera from './Camera'

describe('Camera', () => {
  it('creates perspective camera using container aspect ratio', () => {
    const camera = new Camera({ clientWidth: 1200, clientHeight: 600 } as Element)

    expect(camera.get().aspect).toBe(2)
    expect(camera.get().fov).toBe(70)
  })

  it('updates aspect and fov values', () => {
    const camera = new Camera({ clientWidth: 1000, clientHeight: 500 } as Element)

    camera.setAspect(1.5)
    camera.setFov(55)

    expect(camera.get().aspect).toBe(1.5)
    expect(camera.get().fov).toBe(55)
  })

  it('looks at coordinates calculated from lat/lng', () => {
    const camera = new Camera({ clientWidth: 800, clientHeight: 400 } as Element)
    const lookAtSpy = vi.spyOn(camera.get(), 'lookAt')

    camera.lookAt(0, 0)

    const args = lookAtSpy.mock.calls[0]
    expect(args[0] as number).toBeCloseTo(500, 6)
    expect(args[1] as number).toBeCloseTo(0, 6)
    expect(args[2] as number).toBeCloseTo(0, 6)
  })
})
