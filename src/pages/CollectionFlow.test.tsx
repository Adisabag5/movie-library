import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import Collections from './Collections'
import PosterCard from '../components/PosterCard'
import { useCollection } from '../stores/collection'
import { makeMovie, makeSeries, renderWithProviders } from '../test/utils'

const STORAGE_KEY = 'movie-library-collection'

beforeEach(() => {
    useCollection.setState({ items: [] })
})

describe('collecting a title', () => {
    it('adds from a poster and shows it on the collections page', async () => {
        const movie = makeMovie({ title: 'Whiplash' })
        const { user, unmount } = renderWithProviders(<PosterCard item={movie} />)

        await user.click(screen.getByRole('button', { name: /add whiplash to collection/i }))
        unmount()

        renderWithProviders(<Collections />)

        expect(screen.getByRole('link', { name: /whiplash/i })).toBeInTheDocument()
    })

    it('removes it again on a second toggle', async () => {
        const movie = makeMovie({ title: 'Whiplash' })
        const { user } = renderWithProviders(<PosterCard item={movie} />)

        await user.click(screen.getByRole('button', { name: /add/i }))
        await user.click(screen.getByRole('button', { name: /remove/i }))

        expect(useCollection.getState().items).toHaveLength(0)
    })

    it('keeps a movie and a series with the same id apart', async () => {
        const movie = makeMovie({ id: 42, title: 'Same Id Movie' })
        const series = makeSeries({ id: 42, name: 'Same Id Series' })
        const { user } = renderWithProviders(
            <>
                <PosterCard item={movie} />
                <PosterCard item={series} />
            </>
        )

        await user.click(screen.getByRole('button', { name: /add same id movie/i }))
        await user.click(screen.getByRole('button', { name: /add same id series/i }))

        expect(useCollection.getState().items).toHaveLength(2)
    })

    it('invites the user to browse when the collection is empty', () => {
        renderWithProviders(<Collections />)

        expect(screen.getByText(/your collection is empty/i)).toBeInTheDocument()
    })
})

describe('persistence', () => {
    it('writes the collection to storage under the current version', async () => {
        const { user } = renderWithProviders(<PosterCard item={makeMovie()} />)

        await user.click(screen.getByRole('button', { name: /add/i }))

        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as {
            version: number
            state: { items: unknown[] }
        }
        expect(stored.version).toBe(1)
        expect(stored.state.items).toHaveLength(1)
    })

    it('keeps collections written before versioning existed', async () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ state: { items: [makeMovie({ title: 'Legacy Pick' })] }, version: 0 })
        )

        await useCollection.persist.rehydrate()

        expect(useCollection.getState().items).toMatchObject([{ title: 'Legacy Pick' }])
    })
})
