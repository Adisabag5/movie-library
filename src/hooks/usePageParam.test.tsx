import type { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { usePageParam } from './usePageParam'

// Pairs the hook with the live location so a test can assert on the URL the
// hook actually produced, not just on its return value.
function useParamProbe() {
  const { page, goToPage } = usePageParam()
  const { search } = useLocation()
  return { page, goToPage, search }
}

const renderAt = (route: string) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
  )
  return renderHook(() => useParamProbe(), { wrapper })
}

describe('usePageParam', () => {
  it('defaults to page 1 when the parameter is absent', () => {
    expect(renderAt('/movies').result.current.page).toBe(1)
  })

  it('reads a valid page from the query string', () => {
    expect(renderAt('/movies?page=4').result.current.page).toBe(4)
  })

  it.each(['0', '-3', 'banana', ''])('clamps a nonsense page (%s) up to 1', (value) => {
    expect(renderAt(`/movies?page=${value}`).result.current.page).toBe(1)
  })

  // TMDB rejects anything past 500 even when total_pages says otherwise, so a
  // hand-typed or bookmarked ?page=600 must never reach the network.
  it('clamps a page above the TMDB maximum on read', () => {
    expect(renderAt('/movies?page=600').result.current.page).toBe(500)
  })

  it('clamps on write too', () => {
    const { result } = renderAt('/movies')

    act(() => result.current.goToPage(9999))

    expect(result.current.page).toBe(500)
  })

  it('moves to the requested page', () => {
    const { result } = renderAt('/movies?page=2')

    act(() => result.current.goToPage(3))

    expect(result.current.page).toBe(3)
    expect(result.current.search).toContain('page=3')
  })

  // The bug this guards: setSearchParams({ page }) replaces the entire query
  // string, so any other parameter the page grows later would vanish on every
  // pagination click.
  it('preserves other query parameters when changing page', () => {
    const { result } = renderAt('/movies?page=2&genre=horror&q=alien')

    act(() => result.current.goToPage(3))

    const params = new URLSearchParams(result.current.search)
    expect(params.get('page')).toBe('3')
    expect(params.get('genre')).toBe('horror')
    expect(params.get('q')).toBe('alien')
  })
})
