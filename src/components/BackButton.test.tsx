import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import BackButton from './BackButton'

const CurrentPath = () => <p data-testid="path">{useLocation().pathname}</p>

const ListPage = () => (
  <>
    <CurrentPath />
    <Link to="/movie/9">Open film</Link>
  </>
)

const DetailsPage = () => (
  <>
    <CurrentPath />
    <BackButton fallback="/movies" label="All movies" />
  </>
)

const renderApp = (entry: string) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/movies" element={<ListPage />} />
        <Route path="/movie/:id" element={<DetailsPage />} />
      </Routes>
    </MemoryRouter>
  )

describe('BackButton', () => {
  // Landing straight on a details page (a shared link, or a refresh) leaves
  // nothing behind it in history. navigate(-1) there would walk the user out
  // of the app, so the button falls back to the listing instead.
  it('goes to the fallback route when there is no history behind it', async () => {
    const user = userEvent.setup()
    renderApp('/movie/9')

    expect(screen.getByTestId('path')).toHaveTextContent('/movie/9')

    await user.click(screen.getByRole('button', { name: /all movies/i }))

    expect(screen.getByTestId('path')).toHaveTextContent('/movies')
  })

  it('steps back through real history when the user navigated here', async () => {
    const user = userEvent.setup()
    renderApp('/movies')

    await user.click(screen.getByRole('link', { name: /open film/i }))
    expect(screen.getByTestId('path')).toHaveTextContent('/movie/9')

    await user.click(screen.getByRole('button', { name: /all movies/i }))

    expect(screen.getByTestId('path')).toHaveTextContent('/movies')
  })

  it('renders the label it is given', () => {
    render(
      <MemoryRouter>
        <BackButton fallback="/series" label="All series" />
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: /all series/i })).toBeInTheDocument()
  })
})
