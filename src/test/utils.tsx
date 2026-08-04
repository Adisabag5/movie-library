import type { ReactElement, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import type { Movie, MovieDetails } from '../types/movie'
import type { Series, SeriesDetails } from '../types/series'
import type { Paginated } from '../types/api'

export const currentUrl = () => decodeURIComponent(screen.getByTestId('url').textContent ?? '')

export function stubTmdb(body: unknown = null) {
  let responseBody = body
  let status = 200

  const fetchMock = vi.fn((_url: string) =>
    Promise.resolve(new Response(JSON.stringify(responseBody), { status }))
  )
  vi.stubGlobal('fetch', fetchMock)

  const urls = () =>
    fetchMock.mock.calls.map((call) =>
      decodeURIComponent(String(call[0]).replace('https://api.themoviedb.org/3', ''))
    )

  return {
    fetchMock,
    urls,
    lastUrl: () => urls().at(-1) ?? '',
    calledWith: (fragment: string) => urls().some((url) => url.includes(fragment)),
    respondWith: (next: unknown) => {
      responseBody = next
    },
    failWith: (nextStatus: number) => {
      status = nextStatus
    },
  }
}

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
    },
  })
}

interface RenderOptions {
  route?: string
  queryClient?: QueryClient
}

export function renderWithProviders(ui: ReactElement, options: RenderOptions = {}) {
  const { route = '/', queryClient = createTestQueryClient() } = options

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </QueryClientProvider>
  )

  return {
    queryClient,
    user: userEvent.setup(),
    ...render(ui, { wrapper }),
  }
}

let nextId = 1

export function makeMovie(overrides: Partial<Movie> = {}): Movie {
  return {
    adult: false,
    backdrop_path: '/backdrop.jpg',
    genre_ids: [28],
    id: nextId++,
    original_language: 'en',
    original_title: 'A Movie',
    overview: 'A movie about something.',
    popularity: 10,
    poster_path: '/poster.jpg',
    release_date: '2024-05-01',
    title: 'A Movie',
    video: false,
    vote_average: 7.5,
    vote_count: 100,
    ...overrides,
  }
}

export function makeSeries(overrides: Partial<Series> = {}): Series {
  return {
    adult: false,
    backdrop_path: '/backdrop.jpg',
    genre_ids: [18],
    id: nextId++,
    origin_country: ['US'],
    original_language: 'en',
    original_name: 'A Series',
    overview: 'A series about something.',
    popularity: 12,
    poster_path: '/poster.jpg',
    first_air_date: '2023-03-02',
    name: 'A Series',
    vote_average: 8.1,
    vote_count: 200,
    ...overrides,
  }
}

export function makeMovieDetails(overrides: Partial<MovieDetails> = {}): MovieDetails {
  const { genre_ids: _ignored, ...base } = makeMovie()
  return {
    ...base,
    genres: [{ id: 28, name: 'Action' }],
    runtime: 102,
    tagline: 'A tagline.',
    status: 'Released',
    ...overrides,
  }
}

export function makeSeriesDetails(overrides: Partial<SeriesDetails> = {}): SeriesDetails {
  const { genre_ids: _ignored, ...base } = makeSeries()
  return {
    ...base,
    created_by: [],
    episode_run_time: [45],
    genres: [{ id: 18, name: 'Drama' }],
    homepage: '',
    in_production: true,
    languages: ['en'],
    last_air_date: '2024-01-01',
    last_episode_to_air: null,
    next_episode_to_air: null,
    networks: [],
    number_of_episodes: 24,
    number_of_seasons: 3,
    production_companies: [],
    production_countries: [],
    seasons: [],
    spoken_languages: [],
    status: 'Returning Series',
    tagline: 'A series tagline.',
    type: 'Scripted',
    ...overrides,
  }
}

export function makePage<T>(results: T[], overrides: Partial<Paginated<T>> = {}): Paginated<T> {
  return {
    page: 1,
    results,
    total_pages: 10,
    total_results: results.length * 10,
    ...overrides,
  }
}
