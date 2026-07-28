import { onlineManager } from '@tanstack/react-query'
import { screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Home from './Home'
import { makeMovie, makePage, makeSeries, renderWithProviders } from '../test/utils'

// Exercises the whole stack the page actually uses — hooks/queries.ts and
// core/http.ts included — with only the network faked.
const popular = makePage([makeMovie({ id: 1, title: 'Heat' })])
const topRated = makePage([makeMovie({ id: 2, title: 'Casablanca' })])
const series = makePage([makeSeries({ id: 3, name: 'The Wire' })])

type Outcome = { ok: true; body: unknown } | { ok: false; status: number }

let outcomes: Record<string, Outcome>

const ok = (body: unknown): Outcome => ({ ok: true, body })

beforeEach(() => {
  outcomes = {
    '/movie/popular': ok(popular),
    '/movie/top_rated': ok(topRated),
    '/tv/popular': ok(series),
  }

  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      const match = Object.keys(outcomes).find((path) => url.includes(path))
      const outcome = match ? outcomes[match] : undefined

      if (!outcome) return Promise.resolve(new Response('{}', { status: 404 }))
      if (!outcome.ok) return Promise.resolve(new Response('{}', { status: outcome.status }))
      return Promise.resolve(new Response(JSON.stringify(outcome.body), { status: 200 }))
    })
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Home', () => {
  it('renders the hero and all three rows once the data arrives', async () => {
    renderWithProviders(<Home />)

    expect(await screen.findByRole('heading', { name: 'Heat', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Movies' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Series' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Top Rated' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /the wire/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /casablanca/i })).toBeInTheDocument()
  })

  // The point of resolving each row independently: one bad endpoint must not
  // blank the entire landing page, which is what the old
  // isPending/isError-OR-of-three-queries did.
  it('keeps the healthy rows when one query fails', async () => {
    outcomes['/tv/popular'] = { ok: false, status: 500 }

    renderWithProviders(<Home />)

    expect(await screen.findByText(/could not load series/i)).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Heat', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /casablanca/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /the wire/i })).not.toBeInTheDocument()
  })

  it('still shows the movie rows when the top rated request fails', async () => {
    outcomes['/movie/top_rated'] = { ok: false, status: 500 }

    renderWithProviders(<Home />)

    expect(await screen.findByRole('link', { name: /the wire/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Heat', level: 2 })).toBeInTheDocument()
  })

  // Home and the browse pages both ask for page 1, and queryOptions() gives
  // them one shared cache key — so the three endpoints are hit once each,
  // never twice for the same URL.
  it('requests each endpoint exactly once', async () => {
    renderWithProviders(<Home />)

    await screen.findByRole('link', { name: /casablanca/i })

    const calls = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.map(
      (call) => String(call[0])
    )
    const paths = ['/movie/popular', '/movie/top_rated', '/tv/popular']

    for (const path of paths) {
      expect(calls.filter((url) => url.includes(path))).toHaveLength(1)
    }
  })

  it('shows a loading state before any data has arrived', () => {
    const { container } = renderWithProviders(<Home />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(container.querySelectorAll('.animate-shimmer').length).toBeGreaterThan(0)
  })

  // Note it is onlineManager that has to be told, not navigator.onLine:
  // TanStack Query reads its own manager, which captured the online state
  // when the module was imported, so stubbing the navigator getter does
  // nothing at all.
  it('surfaces an offline pause instead of an endless skeleton', async () => {
    onlineManager.setOnline(false)

    try {
      renderWithProviders(<Home />)

      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent(/offline/i)
      })
    } finally {
      onlineManager.setOnline(true)
    }
  })
})
