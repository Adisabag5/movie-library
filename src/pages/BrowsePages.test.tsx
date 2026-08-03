import { onlineManager } from '@tanstack/react-query'
import { screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Movies from './Movies'
import Series from './Series'
import { makeMovie, makePage, makeSeries, renderWithProviders } from '../test/utils'

// Ported from the old BrowsePage suite when that component was dissolved into
// the two pages. The behaviours are the same; they are now asserted through
// the real query layer with only fetch faked.

let fetchMock: ReturnType<typeof vi.fn>
let body: unknown
let status = 200

beforeEach(() => {
  status = 200
  body = makePage([makeMovie({ title: 'Sicario' })])
  fetchMock = vi.fn(() =>
    Promise.resolve(new Response(JSON.stringify(body), { status }))
  )
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Movies', () => {
  it('shows the heading and the grid once data arrives', async () => {
    renderWithProviders(<Movies />, { route: '/movies' })

    expect(await screen.findByRole('link', { name: /sicario/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Movies' })).toBeInTheDocument()
  })

  it('renders no grid or pager while the first page loads', () => {
    renderWithProviders(<Movies />, { route: '/movies' })

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('shows an error with a working retry instead of the grid', async () => {
    status = 500

    const { user } = renderWithProviders(<Movies />, { route: '/movies' })

    expect(
      await screen.findByText(/could not load movies/i)
    ).toBeInTheDocument()

    fetchMock.mockClear()
    await user.click(screen.getByRole('button', { name: /try again/i }))

    expect(fetchMock).toHaveBeenCalled()
  })

  // Under keepPreviousData the grid can still be showing the previous page,
  // so the label must describe what is on screen — not the page the URL asked
  // for.
  it('labels the pager from the data on screen, not the URL', async () => {
    body = makePage([makeMovie()], { page: 4, total_pages: 20 })

    renderWithProviders(<Movies />, { route: '/movies?page=9' })

    expect(await screen.findByText('Page 4 of 20')).toBeInTheDocument()
  })

  it('caps total pages at the TMDB maximum', async () => {
    body = makePage([makeMovie()], { page: 1, total_pages: 4000 })

    renderWithProviders(<Movies />, { route: '/movies' })

    expect(await screen.findByText('Page 1 of 500')).toBeInTheDocument()
  })

  it('requests the next page when the pager advances', async () => {
    body = makePage([makeMovie()], { page: 2, total_pages: 9 })

    const { user } = renderWithProviders(<Movies />, { route: '/movies?page=2' })

    await screen.findByText('Page 2 of 9')
    fetchMock.mockClear()

    await user.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      const urls = fetchMock.mock.calls.map((call) => String(call[0]))
      expect(urls.some((url) => url.includes('page=3'))).toBe(true)
    })
  })

  it('reads the starting page from the query string', async () => {
    renderWithProviders(<Movies />, { route: '/movies?page=5' })

    await waitFor(() => {
      const urls = fetchMock.mock.calls.map((call) => String(call[0]))
      expect(urls.some((url) => url.includes('page=5'))).toBe(true)
    })
  })

  it('banners an offline pause rather than an endless skeleton', async () => {
    onlineManager.setOnline(false)

    try {
      renderWithProviders(<Movies />, { route: '/movies' })

      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent(/offline/i)
      })
    } finally {
      onlineManager.setOnline(true)
    }
  })
})

describe('Series', () => {
  it('renders its own heading and grid', async () => {
    body = makePage([makeSeries({ name: 'The Wire' })])

    renderWithProviders(<Series />, { route: '/series' })

    expect(await screen.findByRole('link', { name: /the wire/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Series' })).toBeInTheDocument()
  })

  it('hits the tv endpoint, not the movie one', async () => {
    body = makePage([makeSeries()])

    renderWithProviders(<Series />, { route: '/series' })

    await waitFor(() => {
      const urls = fetchMock.mock.calls.map((call) => String(call[0]))
      expect(urls.some((url) => url.includes('/tv/'))).toBe(true)
    })
  })

  // The copy-paste bug this codebase has actually had: the series page
  // reporting "Could not load movies".
  it('reports failures with the series wording', async () => {
    status = 500

    renderWithProviders(<Series />, { route: '/series' })

    expect(await screen.findByText(/could not load series/i)).toBeInTheDocument()
  })
})
