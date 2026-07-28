import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchMovieDetails, fetchPopularMovies, TmdbError } from './http'

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), { status: 200, ...init })

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchFromTmdb', () => {
  it('returns the parsed body on success', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ page: 1, results: [] }))

    const result = await fetchPopularMovies(1, new AbortController().signal)

    expect(result).toEqual({ page: 1, results: [] })
  })

  it('requests the endpoint for the page it was asked for', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}))

    await fetchPopularMovies(3, new AbortController().signal)

    const url = String(fetchMock.mock.calls[0]?.[0])
    expect(url).toContain('/movie/popular')
    expect(url).toContain('page=3')
  })

  // signal is a required parameter precisely so a call site cannot quietly
  // drop cancellation — assert it actually reaches fetch.
  it('forwards the abort signal to fetch', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}))
    const controller = new AbortController()

    await fetchMovieDetails('123', controller.signal)

    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ signal: controller.signal })
  })

  it('rejects with a TmdbError carrying the HTTP status', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ status_message: 'Not found' }, { status: 404 }))

    await expect(fetchMovieDetails('nope', new AbortController().signal)).rejects.toThrow(TmdbError)
  })

  it.each([404, 401, 500])('preserves status %i on the thrown error', async (status) => {
    fetchMock.mockResolvedValue(jsonResponse({}, { status }))

    await expect(
      fetchMovieDetails('x', new AbortController().signal)
    ).rejects.toMatchObject({ status })
  })

  // TmdbError must stay a real Error subclass: the retry predicate narrows
  // with instanceof, and existing `error instanceof Error` checks rely on it.
  it('throws something that is still an Error', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, { status: 500 }))

    const error = await fetchMovieDetails('x', new AbortController().signal).catch(
      (e: unknown) => e
    )

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(TmdbError)
    expect((error as Error).name).toBe('TmdbError')
  })

  it('propagates an abort', async () => {
    fetchMock.mockRejectedValue(new DOMException('Aborted', 'AbortError'))

    await expect(
      fetchPopularMovies(1, new AbortController().signal)
    ).rejects.toThrow('Aborted')
  })
})
