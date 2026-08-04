import { screen } from '@testing-library/react'
import { Link, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import MovieDetails from './MovieDetails'
import SeriesDetails from './SeriesDetails'
import {
    makeMovieDetails,
    makeSeriesDetails,
    renderWithProviders,
    stubTmdb,
} from '../test/utils'

let tmdb: ReturnType<typeof stubTmdb>

beforeEach(() => {
    tmdb = stubTmdb(makeMovieDetails())
})

afterEach(() => {
    vi.unstubAllGlobals()
})

const openMovie = (route = '/movie/7') =>
    renderWithProviders(
        <Routes>
            <Route
                path="/movies"
                element={
                    <>
                        <p>Movies listing</p>
                        <Link to="/movie/7">Open film</Link>
                    </>
                }
            />
            <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>,
        { route }
    )

describe('MovieDetails', () => {
    it('renders the film once loaded', async () => {
        tmdb.respondWith(
            makeMovieDetails({
                title: 'Sicario',
                tagline: 'The border is just another line to cross.',
                overview: 'An idealistic agent is enlisted into a task force.',
                runtime: 121,
                release_date: '2015-09-17',
                genres: [{ id: 28, name: 'Action' }],
            })
        )

        openMovie()

        expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Sicario')
        expect(screen.getByText(/border is just another line/i)).toBeInTheDocument()
        expect(screen.getByText(/idealistic agent/i)).toBeInTheDocument()
        expect(screen.getByText('Action')).toBeInTheDocument()
        expect(screen.getByText(/121 min/)).toBeInTheDocument()
    })

    // Deep-linking straight here leaves nothing in history, so navigate(-1)
    // would walk the user out of the app entirely.
    it('falls back to the listing when there is no history behind it', async () => {
        const { user } = openMovie()
        await screen.findByRole('heading', { level: 1 })

        await user.click(screen.getByRole('button', { name: /all movies/i }))

        expect(screen.getByText('Movies listing')).toBeInTheDocument()
    })

    it('steps back through real history when the user navigated here', async () => {
        const { user } = openMovie('/movies')

        await user.click(screen.getByRole('link', { name: /open film/i }))
        await screen.findByRole('heading', { level: 1 })

        await user.click(screen.getByRole('button', { name: /all movies/i }))

        expect(screen.getByText('Movies listing')).toBeInTheDocument()
    })

    // An invalid id used to leave the page on an infinite skeleton, retrying a
    // 404 forever. TmdbError carries the status so the retry predicate can
    // refuse to retry a 4xx.
    it('shows an error for an unknown id instead of retrying forever', async () => {
        tmdb.failWith(404)

        openMovie('/movie/does-not-exist')

        expect(await screen.findByText(/could not load this movie/i)).toBeInTheDocument()
        expect(tmdb.fetchMock).toHaveBeenCalledTimes(1)
    })

    it('offers a retry on failure', async () => {
        tmdb.failWith(500)
        const { user } = openMovie()

        await screen.findByText(/could not load this movie/i)
        tmdb.fetchMock.mockClear()

        await user.click(screen.getByRole('button', { name: /try again/i }))

        expect(tmdb.fetchMock).toHaveBeenCalled()
    })
})

describe('SeriesDetails', () => {
    const openSeries = () =>
        renderWithProviders(
            <Routes>
                <Route path="/series" element={<p>Series listing</p>} />
                <Route path="/series/:id" element={<SeriesDetails />} />
            </Routes>,
            { route: '/series/7' }
        )

    it('renders the show with season and episode counts', async () => {
        tmdb.respondWith(
            makeSeriesDetails({
                name: 'The Wire',
                number_of_seasons: 5,
                number_of_episodes: 60,
                genres: [{ id: 80, name: 'Crime' }],
            })
        )

        openSeries()

        expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('The Wire')
        expect(screen.getByText(/5 seasons/)).toBeInTheDocument()
        expect(screen.getByText(/60 episodes/)).toBeInTheDocument()
        expect(screen.getByText('Crime')).toBeInTheDocument()
    })

    it('reports failures with the series wording, not the movie wording', async () => {
        tmdb.failWith(500)

        openSeries()

        expect(await screen.findByText(/could not load this series/i)).toBeInTheDocument()
    })
})
