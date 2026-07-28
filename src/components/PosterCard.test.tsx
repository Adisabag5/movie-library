import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import PosterCard from './PosterCard'
import { useCollection } from '../stores/collection'
import { makeMovie, makeSeries, renderWithProviders } from '../test/utils'

beforeEach(() => {
  useCollection.setState({ items: [] })
})

describe('PosterCard', () => {
  it('links a movie to its details route', () => {
    renderWithProviders(<PosterCard item={makeMovie({ id: 55, title: 'Arrival' })} />)

    expect(screen.getByRole('link', { name: /arrival/i })).toHaveAttribute(
      'href',
      '/movie/55'
    )
  })

  it('links a series to the series route', () => {
    renderWithProviders(<PosterCard item={makeSeries({ id: 55, name: 'Fargo' })} />)

    expect(screen.getByRole('link', { name: /fargo/i })).toHaveAttribute(
      'href',
      '/series/55'
    )
  })

  it('falls back to a placeholder image when there is no poster', () => {
    renderWithProviders(<PosterCard item={makeMovie({ poster_path: null })} />)

    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      expect.stringContaining('data:image/svg+xml')
    )
  })

  it('adds the item to the collection and reflects it in aria-pressed', async () => {
    const movie = makeMovie({ title: 'Whiplash' })
    const { user } = renderWithProviders(<PosterCard item={movie} />)

    const button = screen.getByRole('button', { name: /add whiplash to collection/i })
    expect(button).toHaveAttribute('aria-pressed', 'false')

    await user.click(button)

    expect(useCollection.getState().items).toHaveLength(1)
    expect(
      screen.getByRole('button', { name: /remove whiplash from collection/i })
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('removes the item again on a second click', async () => {
    const movie = makeMovie({ title: 'Whiplash' })
    const { user } = renderWithProviders(<PosterCard item={movie} />)

    await user.click(screen.getByRole('button', { name: /add/i }))
    await user.click(screen.getByRole('button', { name: /remove/i }))

    expect(useCollection.getState().items).toHaveLength(0)
  })

  // The collect control must be a sibling of the Link, never a descendant —
  // a button inside an anchor is invalid HTML and swallows the click.
  it('keeps the collect button outside the details link', () => {
    renderWithProviders(<PosterCard item={makeMovie()} />)

    const link = screen.getByRole('link')
    const button = screen.getByRole('button')

    expect(link.contains(button)).toBe(false)
  })
})
