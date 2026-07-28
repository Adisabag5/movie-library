import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import MovieDetails from './MovieDetails'
import SeriesDetails from './SeriesDetails'
import {
  makeMovieDetails,
  makeSeriesDetails,
  renderWithProviders,
} from '../test/utils'

let fetchMock: ReturnType<typeof vi.fn>

const respondWith = (body: unknown, status = 200) =>
  fetchMock.mockResolvedValue(new Response(JSON.stringify(body), { status }))

beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const renderMovie = () =>
  renderWithProviders(
    <Routes>
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/movies" element={<p>Movies listing</p>} />
    </Routes>,
    { route: '/movie/7' }
  )

const renderSeries = () =>
  renderWithProviders(
    <Routes>
      <Route path="/series/:id" element={<SeriesDetails />} />
      <Route path="/series" element={<p>Series listing</p>} />
    </Routes>,
    { route: '/series/7' }
  )

describe('MovieDetails', () => {
  it('renders the film once loaded', async () => {
    respondWith(
      makeMovieDetails({
        title: 'Sicario',
        tagline: 'The border is just another line to cross.',
        overview: 'An idealistic agent is enlisted into a task force.',
        runtime: 121,
        release_date: '2015-09-17',
        vote_average: 7.6,
        genres: [
          { id: 28, name: 'Action' },
          { id: 53, name: 'Thriller' },
        ],
      })
    )

    renderMovie()

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Sicario')
    expect(screen.getByText(/border is just another line/i)).toBeInTheDocument()
    expect(screen.getByText(/idealistic agent/i)).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Thriller')).toBeInTheDocument()
    expect(screen.getByText(/121 min/)).toBeInTheDocument()
    expect(screen.getByText(/2015/)).toBeInTheDocument()
  })

  it('offers a way back to the listing', async () => {
    respondWith(makeMovieDetails())
    const { user } = renderMovie()

    await screen.findByRole('heading', { level: 1 })
    await user.click(screen.getByRole('button', { name: /all movies/i }))

    expect(screen.getByText('Movies listing')).toBeInTheDocument()
  })

  it('omits the poster when the film has none', async () => {
    respondWith(makeMovieDetails({ poster_path: null }))

    renderMovie()
    await screen.findByRole('heading', { level: 1 })

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('shows an error with a retry when the request fails', async () => {
    respondWith({ status_message: 'Not found' }, 404)

    const { user } = renderMovie()

    expect(await screen.findByText(/could not load this movie/i)).toBeInTheDocument()

    fetchMock.mockClear()
    await user.click(screen.getByRole('button', { name: /try again/i }))

    expect(fetchMock).toHaveBeenCalled()
  })

  // A paused query is also pending, so the paused branch has to be checked
  // first — otherwise an offline details page renders a skeleton that can
  // never resolve.
  it('shows the offline banner rather than a skeleton that never resolves', async () => {
    const { onlineManager } = await import('@tanstack/react-query')
    onlineManager.setOnline(false)

    try {
      renderMovie()
      expect(await screen.findByRole('status')).toHaveTextContent(/offline/i)
    } finally {
      onlineManager.setOnline(true)
    }
  })
})

describe('SeriesDetails', () => {
  it('renders the show with season and episode counts', async () => {
    respondWith(
      makeSeriesDetails({
        name: 'The Wire',
        number_of_seasons: 5,
        number_of_episodes: 60,
        first_air_date: '2002-06-02',
        genres: [{ id: 80, name: 'Crime' }],
      })
    )

    renderSeries()

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('The Wire')
    expect(screen.getByText(/5 seasons/)).toBeInTheDocument()
    expect(screen.getByText(/60 episodes/)).toBeInTheDocument()
    expect(screen.getByText('Crime')).toBeInTheDocument()
  })

  it('uses the singular when a show has one season', async () => {
    respondWith(makeSeriesDetails({ number_of_seasons: 1 }))

    renderSeries()
    await screen.findByRole('heading', { level: 1 })

    expect(screen.getByText(/1 season(?!s)/)).toBeInTheDocument()
  })

  it('sends the user back to the series listing', async () => {
    respondWith(makeSeriesDetails())
    const { user } = renderSeries()

    await screen.findByRole('heading', { level: 1 })
    await user.click(screen.getByRole('button', { name: /all series/i }))

    expect(screen.getByText('Series listing')).toBeInTheDocument()
  })

  it('reports a failure with the series wording, not the movie wording', async () => {
    respondWith({}, 500)

    renderSeries()

    expect(await screen.findByText(/could not load this series/i)).toBeInTheDocument()
  })
})
