import { onlineManager } from '@tanstack/react-query'
import { screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Movies from './Movies'
import Series from './Series'
import { LocationProbe } from '../test/LocationProbe'
import {
    currentUrl,
    makeMovie,
    makePage,
    makeSeries,
    renderWithProviders,
    stubTmdb,
} from '../test/utils'

// The browse pages are where filters, search, pagination and the endpoint
// switch all meet, so this suite drives the real query layer with only fetch
// faked. Asserting on the request URL is the point: that is the seam where
// filters silently stopped working before.

let tmdb: ReturnType<typeof stubTmdb>

beforeEach(() => {
    tmdb = stubTmdb(makePage([makeMovie({ title: 'Sicario' })]))
})

afterEach(() => {
    vi.unstubAllGlobals()
})

const openMovies = (route = '/movies') =>
    renderWithProviders(
        <>
            <Movies />
            <LocationProbe />
        </>,
        { route }
    )

const pickGenre = async (user: ReturnType<typeof openMovies>['user'], name: string) => {
    await user.click(screen.getByRole('button', { name: 'Genre' }))
    await user.click(screen.getByRole('checkbox', { name }))
}

describe('Movies — listing', () => {
    it('renders the grid once data arrives', async () => {
        openMovies()

        expect(await screen.findByRole('link', { name: /sicario/i })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Movies' })).toBeInTheDocument()
    })

    it('offers a retry instead of a dead end when the request fails', async () => {
        tmdb.failWith(500)
        const { user } = openMovies()

        expect(await screen.findByText(/could not load movies/i)).toBeInTheDocument()

        tmdb.fetchMock.mockClear()
        await user.click(screen.getByRole('button', { name: /try again/i }))

        expect(tmdb.fetchMock).toHaveBeenCalled()
    })

    it('banners an offline pause rather than an endless skeleton', async () => {
        onlineManager.setOnline(false)
        try {
            openMovies()
            await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/offline/i))
        } finally {
            onlineManager.setOnline(true)
        }
    })

    it('renders a placeholder rather than a broken image when a poster is missing', async () => {
        tmdb.respondWith(makePage([makeMovie({ title: 'No Art', poster_path: null })]))
        openMovies()

        const poster = await screen.findByRole('img', { name: 'No Art' })
        expect(poster).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml'))
    })
})

describe('Movies — pagination', () => {
    // Under keepPreviousData the grid can still be showing the previous page,
    // so the label has to describe the data on screen, not the URL.
    it('labels the pager from the data on screen, not the URL', async () => {
        tmdb.respondWith(makePage([makeMovie()], { page: 4, total_pages: 20 }))
        openMovies('/movies?page=9')

        expect(await screen.findByText('Page 4 of 20')).toBeInTheDocument()
    })

    // TMDB rejects anything past 500 even when total_pages says otherwise.
    it('caps the pager at the TMDB maximum', async () => {
        tmdb.respondWith(makePage([makeMovie()], { page: 1, total_pages: 4000 }))
        openMovies()

        expect(await screen.findByText('Page 1 of 500')).toBeInTheDocument()
    })

    it('requests the page named in the URL, and the next one on demand', async () => {
        tmdb.respondWith(makePage([makeMovie()], { page: 2, total_pages: 9 }))
        const { user } = openMovies('/movies?page=2')

        await screen.findByText('Page 2 of 9')
        expect(tmdb.calledWith('page=2')).toBe(true)

        await user.click(screen.getByRole('button', { name: /next page/i }))

        await waitFor(() => expect(tmdb.calledWith('page=3')).toBe(true))
    })
})

describe('Movies — filters', () => {
    it('moves from /popular to /discover when a filter is applied', async () => {
        const { user } = openMovies()
        await screen.findByRole('link', { name: /sicario/i })
        expect(tmdb.lastUrl()).toContain('/movie/popular')

        await pickGenre(user, 'Horror')

        await waitFor(() => expect(tmdb.lastUrl()).toContain('/discover/movie'))
        expect(tmdb.lastUrl()).toContain('with_genres=27')
    })

    it('puts the filter in the URL so the view can be shared', async () => {
        const { user } = openMovies()
        await screen.findByRole('link', { name: /sicario/i })

        await pickGenre(user, 'Horror')

        await waitFor(() => expect(currentUrl()).toContain('genre=27'))
    })

    it('restores the filter from a shared URL', async () => {
        openMovies('/movies?genre=27&rating=8')

        await waitFor(() => expect(tmdb.lastUrl()).toContain('with_genres=27'))
        expect(tmdb.lastUrl()).toContain('vote_average.gte=8')
        expect(screen.getByRole('button', { name: 'Rating' })).toHaveTextContent('8+ Great')
    })

    // A checkbox list reads as "any of these"; a comma would mean AND and make
    // every extra tick shrink the results.
    it('OR-joins several genres rather than AND-joining them', async () => {
        const { user } = openMovies('/movies?genre=27')
        await screen.findByRole('link', { name: /sicario/i })

        await pickGenre(user, 'Drama')

        await waitFor(() => expect(tmdb.lastUrl()).toContain('with_genres=27|18'))
    })

    it('maps duration and year to their TMDB parameters', async () => {
        openMovies('/movies?duration=90-120&year=2020')

        await waitFor(() => expect(tmdb.lastUrl()).toContain('with_runtime.gte=90'))
        expect(tmdb.lastUrl()).toContain('with_runtime.lte=120')
        expect(tmdb.lastUrl()).toContain('primary_release_year=2020')
    })

    // Filtering to two pages while the URL still says page 7 asks for a page
    // that does not exist and renders an empty grid.
    it('resets the page when a filter changes', async () => {
        const { user } = openMovies('/movies?page=7')
        await screen.findByRole('link', { name: /sicario/i })

        await pickGenre(user, 'Horror')

        await waitFor(() => expect(currentUrl()).not.toContain('page=7'))
    })

    it('clears every filter from the URL on reset', async () => {
        const { user } = openMovies('/movies?genre=27&rating=8')
        await screen.findByRole('link', { name: /sicario/i })

        await user.click(screen.getByRole('button', { name: /clear all filters/i }))

        await waitFor(() => expect(currentUrl()).not.toContain('genre='))
        expect(currentUrl()).not.toContain('rating=')
    })
})

describe('Movies — search', () => {
    // Typing must not fire a request per keystroke.
    it('debounces typing into a single /search request', async () => {
        const { user } = openMovies()
        await screen.findByRole('link', { name: /sicario/i })
        tmdb.fetchMock.mockClear()

        await user.type(screen.getByRole('searchbox'), 'batman')

        await waitFor(() => expect(tmdb.calledWith('/search/movie')).toBe(true))
        expect(tmdb.urls().filter((url) => url.includes('/search/movie'))).toHaveLength(1)
        expect(tmdb.lastUrl()).toContain('query=batman')
    })

    // TMDB cannot honour a text query and discover filters in one request, so
    // the filters are turned off and the reason is stated.
    it('disables the filters while searching and explains why', async () => {
        openMovies('/movies?q=batman')

        await waitFor(() =>
            expect(screen.getByRole('status')).toHaveTextContent(/unavailable while searching/i)
        )
        expect(screen.getByRole('button', { name: 'Genre' })).toHaveAttribute(
            'aria-disabled',
            'true'
        )
    })

    it('ignores filters while a search is active, and restores them after', async () => {
        const { user } = openMovies('/movies?q=batman&genre=27')

        await waitFor(() => expect(tmdb.lastUrl()).toContain('/search/movie'))
        expect(tmdb.lastUrl()).not.toContain('with_genres')

        await user.click(screen.getByRole('button', { name: /clear search/i }))

        await waitFor(() => expect(tmdb.lastUrl()).toContain('/discover/movie'))
        expect(tmdb.lastUrl()).toContain('with_genres=27')
    })
})

describe('Series', () => {
    beforeEach(() => {
        tmdb.respondWith(makePage([makeSeries({ name: 'The Wire' })]))
    })

    const openSeries = (route = '/series') =>
        renderWithProviders(
            <>
                <Series />
                <LocationProbe />
            </>,
            { route }
        )

    it('renders its own grid from the tv endpoint', async () => {
        openSeries()

        expect(await screen.findByRole('link', { name: /the wire/i })).toBeInTheDocument()
        expect(tmdb.lastUrl()).toContain('/tv/popular')
    })

    // Movie and TV genre ids are different namespaces — sending 28 (movie
    // Action) to /discover/tv returns nothing at all.
    it('offers TV genre ids, not movie ones', async () => {
        const { user } = openSeries()
        await screen.findByRole('link', { name: /the wire/i })

        await user.click(screen.getByRole('button', { name: 'Genre' }))
        await user.click(screen.getByRole('checkbox', { name: 'Action & Adventure' }))

        await waitFor(() => expect(tmdb.lastUrl()).toContain('with_genres=10759'))
        expect(tmdb.lastUrl()).toContain('/discover/tv')
    })

    it('reports failures with the series wording, not the movie wording', async () => {
        tmdb.failWith(500)
        openSeries()

        expect(await screen.findByText(/could not load series/i)).toBeInTheDocument()
    })
})
