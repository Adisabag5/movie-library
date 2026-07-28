import { describe, expect, it } from 'vitest'
import { imageUrl } from './images'

describe('imageUrl', () => {
  it('builds a TMDB url at the default size', () => {
    expect(imageUrl('/abc.jpg')).toBe('https://image.tmdb.org/t/p/w200/abc.jpg')
  })

  it('honours an explicit size', () => {
    expect(imageUrl('/abc.jpg', 'w1280')).toBe('https://image.tmdb.org/t/p/w1280/abc.jpg')
  })

  // A null poster_path used to yield '', which renders <img src=""> — the
  // browser re-requests the current page and draws a broken-image icon.
  it('returns a placeholder rather than an empty string for a missing path', () => {
    const result = imageUrl(null)

    expect(result).not.toBe('')
    expect(result.startsWith('data:image/svg+xml,')).toBe(true)
  })

  it('gives the placeholder a 2:3 viewBox so it cannot shift the layout', () => {
    expect(decodeURIComponent(imageUrl(null))).toContain('viewBox="0 0 2 3"')
  })
})
