import { beforeEach, describe, expect, it } from 'vitest'
import { useCollection } from './collection'
import { makeMovie, makeSeries } from '../test/utils'

const STORAGE_KEY = 'movie-library-collection'

beforeEach(() => {
  useCollection.setState({ items: [] })
})

describe('collection store', () => {
  it('adds an item that is not in the collection', () => {
    const movie = makeMovie({ title: 'Heat' })

    useCollection.getState().toggle(movie)

    expect(useCollection.getState().items).toHaveLength(1)
  })

  it('removes an item that is already in the collection', () => {
    const movie = makeMovie()

    useCollection.getState().toggle(movie)
    useCollection.getState().toggle(movie)

    expect(useCollection.getState().items).toHaveLength(0)
  })

  // Membership goes through mediaKey, so a movie and a series that happen to
  // share an id must not cancel each other out.
  it('treats a movie and a series with the same id as different items', () => {
    const movie = makeMovie({ id: 7 })
    const series = makeSeries({ id: 7 })

    useCollection.getState().toggle(movie)
    useCollection.getState().toggle(series)

    expect(useCollection.getState().items).toHaveLength(2)

    useCollection.getState().toggle(movie)

    const remaining = useCollection.getState().items
    expect(remaining).toHaveLength(1)
    expect(remaining[0]).toMatchObject({ name: series.name })
  })

  it('writes the collection to localStorage under the current version', () => {
    useCollection.getState().toggle(makeMovie())

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as {
      version: number
      state: { items: unknown[] }
    }

    expect(stored.version).toBe(1)
    expect(stored.state.items).toHaveLength(1)
  })

  // The migrate function is not decorative: zustand DISCARDS persisted state
  // whose version does not match, so shipping `version: 1` without `migrate`
  // would have silently wiped every collection saved before versioning.
  it('keeps collections written before versioning existed', async () => {
    const legacy = {
      state: { items: [makeMovie({ title: 'Legacy Pick' })] },
      version: 0,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy))

    await useCollection.persist.rehydrate()

    const items = useCollection.getState().items
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({ title: 'Legacy Pick' })
  })
})
