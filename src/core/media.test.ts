import { describe, expect, it } from 'vitest'
import { detailsPath, displayName, isMovie, mediaKey } from './media'
import { makeMovie, makeSeries } from '../test/utils'

describe('media helpers', () => {
  it('narrows a movie by its title field', () => {
    expect(isMovie(makeMovie())).toBe(true)
    expect(isMovie(makeSeries())).toBe(false)
  })

  it('reads the display name from title or name', () => {
    expect(displayName(makeMovie({ title: 'Dune' }))).toBe('Dune')
    expect(displayName(makeSeries({ name: 'Severance' }))).toBe('Severance')
  })

  it('routes movies and series to different detail paths', () => {
    expect(detailsPath(makeMovie({ id: 42 }))).toBe('/movie/42')
    expect(detailsPath(makeSeries({ id: 42 }))).toBe('/series/42')
  })

  // The reason mediaKey exists at all: TMDB numbers movies and TV shows in
  // separate namespaces, so movie 42 and series 42 are unrelated titles.
  // Anything keyed on the bare id would treat them as the same item.
  it('keeps movie and series ids in separate namespaces', () => {
    const movie = makeMovie({ id: 42 })
    const series = makeSeries({ id: 42 })

    expect(mediaKey(movie)).toBe('movie-42')
    expect(mediaKey(series)).toBe('tv-42')
    expect(mediaKey(movie)).not.toBe(mediaKey(series))
  })
})
