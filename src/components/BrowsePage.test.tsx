import type { UseQueryResult } from '@tanstack/react-query'
import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BrowsePage from './BrowsePage'
import type { Movie } from '../types/movie'
import type { Paginated } from '../types/api'
import { makeMovie, makePage, renderWithProviders } from '../test/utils'

type MovieQuery = UseQueryResult<Paginated<Movie>>

// BrowsePage takes a query *result*, never a hook, so a test can hand it any
// state directly without a network layer or a fake timer in sight.
const queryResult = (overrides: Partial<MovieQuery> = {}) =>
  ({
    data: undefined,
    isPending: false,
    isError: false,
    isPaused: false,
    isPlaceholderData: false,
    refetch: vi.fn(),
    ...overrides,
  }) as unknown as MovieQuery

const renderBrowse = (query: MovieQuery, onPageChange = vi.fn()) => {
  const view = renderWithProviders(
    <BrowsePage
      title="Movies"
      errorMessage="Could not load movies."
      query={query}
      onPageChange={onPageChange}
    />
  )
  return { ...view, onPageChange }
}

describe('BrowsePage', () => {
  it('shows the heading and grid once data arrives', () => {
    const page = makePage([makeMovie({ title: 'Sicario' }), makeMovie({ title: 'Prisoners' })])
    renderBrowse(queryResult({ data: page }))

    expect(screen.getByRole('heading', { name: 'Movies' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sicario/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /prisoners/i })).toBeInTheDocument()
  })

  it('renders no grid while the first page is loading', () => {
    renderBrowse(queryResult({ isPending: true }))

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('shows an error with a working retry instead of the grid', async () => {
    const refetch = vi.fn()
    const { user } = renderBrowse(queryResult({ isError: true, refetch }))

    expect(screen.getByText('Could not load movies.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /try again/i }))

    expect(refetch).toHaveBeenCalledTimes(1)
  })

  // Offline is checked on its own, not as `isPaused && isPending`: once
  // placeholder data exists isPending is false, which made the old condition
  // unreachable and left the user with no indication at all.
  it('banners an offline pause above data it already has', () => {
    renderBrowse(
      queryResult({ data: makePage([makeMovie({ title: 'Dune' })]), isPaused: true })
    )

    expect(screen.getByRole('status')).toHaveTextContent(/offline/i)
    expect(screen.getByRole('link', { name: /dune/i })).toBeInTheDocument()
  })

  it('banners an offline pause even with nothing cached yet', () => {
    renderBrowse(queryResult({ isPending: true, isPaused: true }))

    expect(screen.getByRole('status')).toHaveTextContent(/offline/i)
  })

  // Under keepPreviousData the grid can still be showing the previous page,
  // so the label has to describe the data on screen — not the URL that asked
  // for the next one.
  it('labels the pager from the data on screen, not the requested page', () => {
    renderBrowse(
      queryResult({
        data: makePage([makeMovie()], { page: 4, total_pages: 20 }),
        isPlaceholderData: true,
      })
    )

    expect(screen.getByText('Page 4 of 20')).toBeInTheDocument()
  })

  it('caps total pages at the TMDB maximum', () => {
    renderBrowse(queryResult({ data: makePage([makeMovie()], { page: 1, total_pages: 4000 }) }))

    expect(screen.getByText('Page 1 of 500')).toBeInTheDocument()
  })

  it('passes page changes up to the caller', async () => {
    const { user, onPageChange } = renderBrowse(
      queryResult({ data: makePage([makeMovie()], { page: 2, total_pages: 9 }) })
    )

    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(onPageChange).toHaveBeenCalledWith(3)
  })
})
