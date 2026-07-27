# movie-library

A movie and series browser built on the [TMDB API](https://developer.themoviedb.org/docs).
Browse popular and top-rated titles, open a details page, and keep a personal collection
that persists across reloads.

Browsing and details only — there is no media player, by design.

## Setup

Requires Node 20.19+ or 22.12+ (Vite 8).

```bash
npm install
```

Create a `.env.local` in the project root with a TMDB API read access token:

```
VITE_TMDB_API_KEY=your_tmdb_read_access_token
```

`.env.local` is gitignored. Note that Vite inlines `VITE_`-prefixed variables into the
client bundle at build time — inherent to a browser-only SPA, so treat the token as public
and use a read-only one.

The variables this app expects are declared in [`src/vite-env.d.ts`](src/vite-env.d.ts).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 5173 |
| `npm run build` | `tsc -b`, then a production build into `dist/` |
| `npm run preview` | Serve the production build on port 4173 |
| `npm run lint` | ESLint, including type-aware rules |

Verify changes with `npx tsc -b`, `npm run lint`, and the browser.

**Measure network behaviour on the production preview, never the dev server.** In dev,
StrictMode double-mounts components and the abort signal cancels the first request, so
every URL appears to be fetched twice. Production fetches once.

## Stack

Vite · React 19 · TypeScript · React Router 7 (data router) · TanStack Query v5 ·
Zustand + `persist` · Tailwind CSS 4.

## Architecture

Four layers, kept separate:

1. **`src/core/http.ts`** — fetch functions only. Knows URLs and JSON shapes, nothing about
   React. Throws `TmdbError`, which carries the HTTP `status` so callers can tell a 404
   (never worth retrying) from a 5xx (worth retrying). Every fetcher takes a **required**
   `AbortSignal`.
2. **`src/hooks/queries.ts`** — one `queryOptions()` factory per resource, then hooks that
   spread it. The factory is what guarantees every consumer of the same data uses the same
   cache key.
3. **`src/components/` and `src/pages/`** — UI. Pages own the data-fetching hooks;
   components take props.
4. **`src/types/`** — `movie.ts`, `series.ts`, and the `Paginated<T>` envelope in `api.ts`.

### Conventions

- **Server state belongs to TanStack Query.** No hand-rolled `useEffect` + `useState`
  fetching anywhere. Zustand holds only client state — currently just the collection.
- **Every list endpoint is paginated,** and "the first page" is simply page 1. That is why
  the home page and the browse pages share one cache entry; Home unwraps the envelope with
  `select` rather than fetching separately.
- **Browse pagination lives in the URL** (`?page=`) via `usePageParam`, so refresh,
  back/forward and link sharing all work. `useState` is reserved for ephemeral UI.
- **Movie and TV ids are separate TMDB namespaces.** Any key or membership check must go
  through `mediaKey()` in `src/core/media.ts`, never a bare `id`.
- **The collection stores whole item snapshots, not ids,** so rendering is instant and works
  offline. The tradeoff is that stored data can go stale.
- **Types are asserted, not validated.** `fetchFromTmdb` casts the parsed JSON to the
  caller's requested type and nothing checks it at runtime. See the comment in
  `src/core/http.ts`.

There is currently no test tooling.
