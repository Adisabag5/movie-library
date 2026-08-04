import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from './Hero'
import { makeMovie, renderWithProviders } from '../test/utils'

const movies = [
    makeMovie({ id: 1, title: 'Blade Runner', release_date: '1982-06-25' }),
    makeMovie({ id: 2, title: 'Alien', release_date: '1979-05-25' }),
]

describe('Hero', () => {
    it('features the first movie and links to it', () => {
        renderWithProviders(<Hero movies={movies} />)

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Blade Runner')
        expect(screen.getByRole('link', { name: /details/i })).toHaveAttribute('href', '/movie/1')
    })

    it('switches the featured movie from the carousel', async () => {
        const { user } = renderWithProviders(<Hero movies={movies} />)

        await user.click(screen.getByRole('button', { name: /show alien/i }))

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Alien')
        expect(screen.getByRole('link', { name: /details/i })).toHaveAttribute('href', '/movie/2')
    })

    // Keying the backdrop on the movie id remounts the <img>, which leaves an
    // empty element for a frame and flashes the panel background through the
    // switch. Swapping only src keeps the previous frame painted.
    it('swaps the backdrop without replacing the element', async () => {
        const { container, user } = renderWithProviders(<Hero movies={movies} />)
        const before = container.querySelector('section > img')

        await user.click(screen.getByRole('button', { name: /show alien/i }))

        expect(container.querySelector('section > img')).toBe(before)
    })

    // Home hands Hero whatever the query returned; an empty list must not
    // crash on movies[0].
    it('renders nothing rather than crashing on an empty list', () => {
        const { container } = renderWithProviders(<Hero movies={[]} />)

        expect(container).toBeEmptyDOMElement()
    })
})
