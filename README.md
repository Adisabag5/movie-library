# Movie Library

A movie and series browser built on the [TMDB API](https://developer.themoviedb.org/docs) —
browse, filter, search, and keep a personal collection that survives a reload.

Browsing and details only, by design. There is no media player.

**Stack:** React 19 · TypeScript · Vite 8 · React Router 7 (data router) · TanStack Query v5 ·
Zustand · Tailwind CSS 4 · Vitest + Testing Library

---

## Why this repo is worth reading

It is a small app, so the interesting part isn't the feature list — it's the decisions. Every
non-obvious one below was made deliberately, and most were made *because something broke first*.

- **Server state and client state are strictly separated.** TanStack Query owns everything that
  comes from the network; Zustand owns the one thing that doesn't. There is no hand-rolled
  `useEffect` + `useState` fetching anywhere in the codebase.
- **All shareable UI state lives in the URL.** Page, filters and search are query parameters, so
  refresh, back/forward and a pasted link all reproduce the same view.
- **Cache-key correctness is enforced structurally**, not by convention.
- **Accessibility and contrast are measured, not eyeballed.** Every colour pair is checked against
  WCAG AA, and two failures were caught that way during a rebrand.

---

## Architecture

Four layers, kept strictly separate. Dependencies only ever point downward.

```
src/
├── pages/        route components — own the data hooks
├── components/   presentational; take props, own no server state
│   ├── filters/  the config-driven filter system
│   └── motion/   reusable scroll/route animations
├── hooks/        URL state, queries, reusable behaviour
├── core/         framework-free logic: HTTP, value mapping, media helpers
├── stores/       Zustand — client state only
├── types/        shared shapes
└── test/         setup + render helpers and fixtures
```

**`core/` knows nothing about React.** It is plain functions: URL building, TMDB parameter
mapping, value normalisation, the `Movie | Series` union helpers. That is what makes it trivially
testable — no renderer, no providers, no mocking a component tree.

### One `queryOptions()` factory per resource

```ts
const popularMoviesQuery = (page: number) =>
  queryOptions({
    queryKey: ['movies', 'popular', page],
    queryFn: ({ signal }) => fetchPopularMovies(page, signal),
  })
```

The key and the fetcher are defined together, once. Two call sites physically cannot disagree
about a cache key — which is the bug this replaced: the home page and the browse page were
fetching the same URL into two different cache entries.

The guarantee is load-bearing. Home asks for page 1 and unwraps the envelope with `select`; the
browse page asks for page 1 and keeps the envelope for its pager. **Same request, same cache
entry, one network call.** Verified on a production build: Home fetches three URLs, then
navigating to Movies and Series adds zero.

That property is fragile, and it broke once when a parameter defaulted to `undefined` instead of
`''` — the two hashed differently and silently split into two entries. It is now pinned by a
default value and understood as something to protect.

### `AbortSignal` is required, not optional

```ts
async function fetchFromTmdb<T>(endpoint: string, signal: AbortSignal): Promise<T>
```

An optional signal lets a call site quietly drop cancellation, and it widens the type to
`AbortSignal | undefined` while `RequestInit.signal` is `AbortSignal | null`. Making it required
means every request is cancellable and the mismatch is impossible.

### Errors are thrown, and they carry status

```ts
export class TmdbError extends Error {
  readonly status: number
}
```

A real `Error` subclass, so `instanceof` narrows it, stack traces survive, and existing
`error instanceof Error` checks keep working. The status is what lets the retry policy tell
"this id doesn't exist" (404, never retry) from "the server is having a bad day" (5xx, retry).

Before this, an invalid id left the page on an **infinite skeleton**, retrying a 404 forever.

### Types are asserted, and the code says so

`fetchFromTmdb` casts the parsed JSON to the caller's type; nothing validates it at runtime. Rather
than hide that behind `any`, the response goes through `unknown` and the assertion is written out
explicitly — one visible `as T` at a single boundary, instead of `any` leaking through the whole
data layer. An honest boundary beats an invisible one.

---

## The filter system

A config-driven form library. Pages declare *what* they want; nothing declares *how*.

```ts
{ name: 'genre', label: 'Genre', options: MOVIE_GENRES, multiple: true }
```

One field shape. `multiple` selects checkboxes and an array; its absence selects radios and a
single value. Both render as the same custom dropdown, because a native `<select multiple>` needs
cmd-click, hides most of its options and is unusable on touch.

The controls know nothing about filters, TMDB or the URL — they take a value and report a change,
so the same components would serve any other form.

**Movie and TV genre IDs are different**, which the API confirms: movies have `Action` (28) and
`Fantasy` (14); TV has neither, carrying `Action & Adventure` (10759) and `Sci-Fi & Fantasy`
(10765). Only 8 IDs overlap. So fields are built per media kind rather than shared — a detail that
silently returns zero results if you get it wrong.

Multiple genres are **OR-joined with `|`**, not comma. TMDB reads a comma as AND, and a checkbox
list implies "any of these":

| Separator | Meaning | Results for Action + Drama |
|---|---|---|
| `\|` | either | 329,839 |
| `,` | both | 14,937 |

### Search is a mode, not a filter

TMDB has no endpoint that does text search *and* structured filtering. `/search` ignores
`with_genres` and `vote_average.gte`; `/discover` ignores `query`. Both verified against the live
API.

So the app treats them as mutually exclusive modes: with a search term it uses `/search` and
visibly disables the filters with an explanation, rather than sending parameters that will be
silently discarded. One hook picks between three endpoints — `/search`, `/discover`, `/popular` —
and each gets its own cache-key prefix so a filtered response can never answer an unfiltered
request.

### Debounced search that doesn't fight the URL

The input is deliberately **not** purely controlled. A `draft` updates per keystroke so typing
stays responsive; the URL holds the committed value; the two reconcile on a delay. Routing every
keystroke through the router and back makes typing laggy and jumps the caret.

Typing "batman" produces **one** request, not six — and **zero** extra history entries, because
the URL write uses `replace: true`. Otherwise the back button would walk out of a search one
character at a time.

---

## State that lives in the URL

`?page=`, `?q=` and every filter are query parameters, each owned by a small hook.

Two bugs worth knowing about, both fixed and both easy to reintroduce:

- **`setSearchParams({ page })` replaces the entire query string.** It silently wiped filters the
  moment they were added. Every writer now uses the functional form over a copy of the existing
  params.
- **Changing a filter must reset the page.** Filtering to two pages of results while the URL still
  says page 7 asks the API for a page that doesn't exist and renders an empty grid that looks
  broken.

---

## Client state

Zustand with `persist`, holding one thing: the collection.

```ts
{ name: 'movie-library-collection', version: 1, migrate: (persisted) => persisted as CollectionState }
```

`migrate` is **required, not decorative**. Zustand *discards* persisted state whose version
doesn't match, so shipping `version: 1` without it would have silently wiped every saved
collection on upgrade. Proven by seeding a version-0 payload and watching it survive.

The store keeps whole item snapshots rather than IDs, so rendering is instant and works offline;
the tradeoff is that stored data can go stale. Correct for a personal collection.

Movie and TV IDs are separate TMDB namespaces, so membership goes through `mediaKey()` — movie 42
and series 42 are unrelated titles, and anything keyed on the bare ID would treat them as one.

---

## Routing and loading

Route-level `lazy` in the router config rather than `React.lazy` + `<Suspense>`, so the router
downloads the chunk during navigation instead of during render. `Home` stays a static import on
purpose — lazy-loading the landing page only delays first paint.

`HydrateFallback` sits on each **child** route, not the root. On the root it renders *instead of*
the layout, so the header disappears during hydration; on a child it renders into the `Outlet` and
the shell survives. Each route also shows the skeleton matching its own content.

`useNavigation()` drives a progress bar during lazy-chunk downloads, and `ScrollRestoration`
handles the position problem SPAs otherwise ignore.

---

## Testing

**44 tests across 5 files** — 84% statements, 81% branches.

The suite is deliberately integration-first and deliberately small. An earlier unit-heavy version
reached 156 tests and covered *less*: pages now drive the real query and HTTP layers with only
`fetch` faked, and the assertions are made on the **request URL** — the seam where both the
endpoint bug and the genre-encoding bug actually lived. A third of the tests, and coverage went up.

Tests target bugs the project actually had, so they are regressions rather than coverage padding:
`mediaKey` namespacing, the placeholder image that used to render `<img src="">`, query-string
preservation, the page clamp, the zustand data-loss guard, the pager labelled from `data.page`
rather than the URL, Prev/Next staying usable while busy, Hero's un-keyed backdrop, and Home's
rows resolving independently when one query fails.

Two environment shims in `src/test/setup.ts` are load-bearing:

- **Node 25 defines its own file-backed `localStorage`** that shadows jsdom's and, without
  `--localstorage-file`, is an inert object with no `getItem`/`setItem`/`clear`. Setup installs a
  real in-memory `Storage`.
- jsdom has no `scrollTo`, which the pagination hook calls.

Also worth recording: **TanStack Query pauses on `onlineManager`, not `navigator.onLine`.**
Stubbing the navigator getter does nothing, because the manager captures state at import.

---

## Accessibility and motion

Every colour pair is measured against WCAG AA rather than judged by eye. A rebrand from terracotta
to turquoise introduced two failures that measurement caught:

| Pair | Before | After |
|---|---|---|
| Button text on accent | 3.53 | **5.17** |
| Card titles on paper | 4.43 | **5.76** |

The brighter teal that *looked* better failed AA for light text on top, so the accent is
deliberately a step darker than the obvious choice.

Custom controls hide the native input rather than replacing it, so semantics, keyboard behaviour
and focus stay intact while a sibling does the drawing. Icon-only buttons carry `aria-label`;
grouped inputs use `fieldset`/`legend` or `role="radiogroup"`; the pager announces through a live
region.

Animations are CSS plus a small `IntersectionObserver` hook — no animation library. The hook
**fails open**: with no observer, content is visible immediately, because failing closed would
leave sections permanently invisible rather than merely un-animated. All of it sits behind
`prefers-reduced-motion`, where reduced motion means *appears instantly*, not *never appears*.

---

## Running it

Requires Node 20.19+ or 22.12+.

```bash
npm install
```

Create `.env.local` with a TMDB read access token:

```
VITE_TMDB_API_KEY=your_tmdb_read_access_token
```

Vite inlines `VITE_`-prefixed variables into the client bundle — inherent to a browser-only SPA, so
treat the token as public and use a read-only one. The variables the app expects are declared in
[`src/vite-env.d.ts`](src/vite-env.d.ts).

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 5173 |
| `npm run build` | `tsc -b`, then a production build into `dist/` |
| `npm run preview` | Serve the production build on port 4173 |
| `npm test` | Vitest |
| `npm run test:coverage` | Vitest with coverage |
| `npm run lint` | ESLint, including type-aware rules |

**Measure network behaviour on the production preview, never the dev server.** In dev, StrictMode
double-mounts and the abort signal cancels the first request, so every URL appears to be fetched
twice. Production fetches once.

---

## Build output

| Asset | Raw | Gzipped |
|---|---|---|
| Main bundle | 367 kB | **127 kB** |
| CSS | 42 kB | 7.4 kB |
| Route chunks | 0.3 – 11 kB | under 4 kB |

Route-level splitting keeps each page under a few kB; the weight is React, React Router and
TanStack Query in the shared bundle. React Query Devtools is correctly stripped from production.

---

## Tooling

`noUncheckedIndexedAccess` and `typescript-eslint`'s `recommendedTypeChecked` are both on.
Type-aware linting earned its place immediately by finding that `import.meta.env` was `any` by
default and that a fetch helper was laundering `Promise<any>` into a typed return.

ESLint resolves projects via `parserOptions.projectService` rather than a hand-maintained list, so
the app/node tsconfig split stays correct on its own.

---

## Known limitations

Stated plainly, because pretending they don't exist is worse than the limitations:

- **No runtime validation of API responses.** Types are asserted, not verified. Zod would fix it;
  it hasn't been added.
- **Search and filters can't combine** — a TMDB constraint, not a design choice.
- **No SSR**, so first paint waits on the JS bundle.
- **Coverage is 84%.** What is left is mostly unreachable from a test render — the router shell
  (`App`, `router`, `RootLayout`) and static presentational pieces — plus `useInView` at 38%,
  because jsdom has no `IntersectionObserver` to exercise.
- Genre lists are hardcoded rather than fetched. They're stable, but the API is the source of truth.
