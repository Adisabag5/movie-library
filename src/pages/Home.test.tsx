import { onlineManager } from '@tanstack/react-query'
import { screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Home from './Home'
import { makeMovie, makePage, makeSeries, renderWithProviders } from '../test/utils'

// Drives the whole stack — hooks/queries.ts and core/http.ts included — with
// only the network faked.
const popular = makePage([makeMovie({ id: 1, title: 'Heat' })])
const topRated = makePage([makeMovie({ id: 2, title: 'Casablanca' })])
const series = makePage([makeSeries({ id: 3, name: 'The Wire' })])

type Outcome = { ok: true; body: unknown } | { ok: false; status: number }

let outcomes: Record<string, Outcome>
let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
    outcomes = {
        '/movie/popular': { ok: true, body: popular },
        '/movie/top_rated': { ok: true, body: topRated },
        '/tv/popular': { ok: true, body: series },
    }

    fetchMock = vi.fn((url: string) => {
        const match = Object.keys(outcomes).find((path) => url.includes(path))
        const outcome = match ? outcomes[match] : undefined
        if (!outcome) return Promise.resolve(new Response('{}', { status: 404 }))
        if (!outcome.ok) return Promise.resolve(new Response('{}', { status: outcome.status }))
        return Promise.resolve(new Response(JSON.stringify(outcome.body), { status: 200 }))
    })
    vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('Home', () => {
    it('renders the hero and all three rows', async () => {
        renderWithProviders(<Home />)

        expect(await screen.findByRole('heading', { name: 'Heat', level: 2 })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Movies' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /the wire/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /casablanca/i })).toBeInTheDocument()
    })

    // The whole point of resolving each section independently: one bad
    // endpoint must not blank the landing page.
    it('keeps the healthy rows when one query fails', async () => {
        outcomes['/tv/popular'] = { ok: false, status: 500 }

        renderWithProviders(<Home />)

        expect(await screen.findByText(/could not load series/i)).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Heat', level: 2 })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /casablanca/i })).toBeInTheDocument()
    })

    // Home used to be the only page where a failed section was a dead end.
    it('offers a retry on the row that failed', async () => {
        outcomes['/tv/popular'] = { ok: false, status: 500 }

        const { user } = renderWithProviders(<Home />)
        await screen.findByText(/could not load series/i)

        fetchMock.mockClear()
        await user.click(screen.getByRole('button', { name: /try again/i }))

        expect(fetchMock).toHaveBeenCalled()
    })

    // Being offline is a page-level fact: one banner, above the content, never
    // instead of it — and never four of them.
    it('announces an offline pause once', async () => {
        onlineManager.setOnline(false)
        try {
            renderWithProviders(<Home />)
            await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/offline/i))
        } finally {
            onlineManager.setOnline(true)
        }
    })

    // queryOptions() factories are what make Home and the browse pages share
    // one cache entry per URL.
    it('requests each endpoint exactly once', async () => {
        renderWithProviders(<Home />)
        await screen.findByRole('link', { name: /casablanca/i })

        const calls = fetchMock.mock.calls.map((call) => String(call[0]))
        for (const path of ['/movie/popular', '/movie/top_rated', '/tv/popular']) {
            expect(calls.filter((url) => url.includes(path))).toHaveLength(1)
        }
    })

    it('gives the landing page a top-level heading even though it is not visible', async () => {
        renderWithProviders(<Home />)

        expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/movie library/i)
    })
})
