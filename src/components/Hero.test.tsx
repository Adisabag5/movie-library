import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from './Hero'
import { makeMovie, renderWithProviders } from '../test/utils'

const movies = [
  makeMovie({ id: 1, title: 'Blade Runner', release_date: '1982-06-25', vote_average: 8.1 }),
  makeMovie({ id: 2, title: 'Alien', release_date: '1979-05-25', vote_average: 8.4 }),
  makeMovie({ id: 3, title: 'Sicario', release_date: '2015-09-17', vote_average: 7.6 }),
]

const featuredHeading = () => screen.getByRole('heading', { level: 2 })

describe('Hero', () => {
  it('features the first movie by default', () => {
    renderWithProviders(<Hero movies={movies} />)

    expect(featuredHeading()).toHaveTextContent('Blade Runner')
    expect(screen.getByText('1982')).toBeInTheDocument()
    expect(screen.getByText(/8\.1/)).toBeInTheDocument()
  })

  it('links Details to the featured movie', () => {
    renderWithProviders(<Hero movies={movies} />)

    expect(screen.getByRole('link', { name: /details/i })).toHaveAttribute(
      'href',
      '/movie/1'
    )
  })

  it('switches the featured movie when a carousel item is picked', async () => {
    const { user } = renderWithProviders(<Hero movies={movies} />)

    await user.click(screen.getByRole('button', { name: /show sicario/i }))

    expect(featuredHeading()).toHaveTextContent('Sicario')
    expect(screen.getByText('2015')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /details/i })).toHaveAttribute(
      'href',
      '/movie/3'
    )
  })

  it('marks exactly one carousel item as pressed', async () => {
    const { user } = renderWithProviders(<Hero movies={movies} />)

    const pressed = () =>
      screen.getAllByRole('button').filter((b) => b.getAttribute('aria-pressed') === 'true')

    expect(pressed()).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: /show alien/i }))

    expect(pressed()).toHaveLength(1)
    expect(pressed()[0]).toHaveAccessibleName(/alien/i)
  })

  // The backdrop must not be keyed on the movie id: a key remounts the <img>,
  // leaving an empty element for a frame that flashes the panel background
  // through the switch. Swapping only src keeps the previous frame painted.
  it('swaps the backdrop without replacing the element', async () => {
    const { container, user } = renderWithProviders(<Hero movies={movies} />)

    const backdropBefore = container.querySelector('section > img')
    expect(backdropBefore).not.toBeNull()

    await user.click(screen.getByRole('button', { name: /show alien/i }))

    const backdropAfter = container.querySelector('section > img')
    expect(backdropAfter).toBe(backdropBefore)
  })

  // Home hands Hero whatever the query returned; an empty list must not crash
  // on movies[0].
  it('renders nothing rather than crashing on an empty list', () => {
    const { container } = renderWithProviders(<Hero movies={[]} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('offers every movie in the carousel', () => {
    renderWithProviders(<Hero movies={movies} />)

    const carousel = screen.getByRole('button', { name: /show alien/i }).parentElement
    expect(within(carousel as HTMLElement).getAllByRole('button')).toHaveLength(3)
  })
})
