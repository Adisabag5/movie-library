# Handoff — Movie Library

Working notes for picking this project back up, and for showcasing it on a personal site.
Written for a future session (human or assistant) that has no memory of how it was built.

**Repo:** https://github.com/Adisabag5/movie-library · **Branch:** `main`

---

## 1. Where the project stands

Feature-complete for its scope: browse, filter, search, details, persistent collection.

| | |
|---|---|
| Source | ~2,500 lines across `src/` |
| Tests | 80 passing, 14 files, 68% statements |
| Bundle | 127 kB gzipped |
| Health | `tsc -b`, `eslint`, `vitest`, `vite build` all clean |

**Everything is committed and pushed.** Run all four checks before believing anything below is
still true.

```bash
npm install && npx tsc -b && npm run lint && npm test && npm run build
```

### Conventions that must not be broken

These are load-bearing. Each replaced a real bug; breaking one reintroduces it.

1. **TanStack Query owns all server state.** No `useEffect` + `useState` fetching. Filters and
   search trigger refetches by being part of the **query key**, never by an effect.
2. **One `queryOptions()` factory per resource.** Never inline a `queryKey` at a call site — that
   is how the same URL ends up in two cache entries.
3. **`AbortSignal` is a required parameter** on every fetcher.
4. **All shareable state lives in the URL**, written with the *functional* form of
   `setSearchParams` over a copy of the existing params. The object-literal form wipes the whole
   query string.
5. **Any filter or search change must delete `page`.**
6. **`mediaKey()` for identity, never a bare `id`** — movie 42 and series 42 are different titles.
7. **Zustand `persist` needs `version` *and* `migrate`.** Version alone discards saved state.
8. **Two shims in `src/test/setup.ts` are required** (Node 25's fake `localStorage`, jsdom's
   missing `scrollTo`). They look like boilerplate. They are not.

### Known gaps

- No runtime validation of API responses (types are asserted, not verified)
- Search and filters can't combine — a TMDB limitation, handled explicitly in the UI
- No SSR; first paint waits on the bundle
- Filter system and debounce hook are the largest untested surfaces
- Genre lists hardcoded rather than fetched
- `src/core/util.ts` is a slightly generic name for what are filter-value helpers

---

## 2. Running and demoing locally

```bash
npm run dev        # localhost:5173 — dev only
npm run build && npm run preview   # localhost:4173 — use this for demos
```

**Demo on the production preview (4173), not the dev server.** Two reasons: React Query Devtools
is stripped from production so it won't cover the UI, and StrictMode's dev double-mount makes
every request appear twice in the network tab, which undercuts the caching story below.

Requires `.env.local`:

```
VITE_TMDB_API_KEY=your_tmdb_read_access_token
```

---

## 3. Demo script

Roughly four minutes. Each beat shows a real engineering decision, not just a feature.

### Beat 1 — Home (15s)

Load `/`. Hero and rows fade up; scrolling reveals each row.

> "Animations are CSS and one IntersectionObserver hook — no animation library. The hook fails
> open, so if the observer never fires the content is still visible rather than invisible forever."

### Beat 2 — URL as state (45s) — *the strongest beat*

Go to Movies. Pick **Genre → Horror** and **Rating → 8+**. The URL becomes
`?genre=27&rating=8`.

**Copy the URL, open it in a new tab.** Identical view.

> "Every shareable piece of state is a query parameter — page, filters, search. Refresh,
> back/forward and a pasted link all reproduce the same view. Filters aren't component state."

Then hit **Back** — it steps through filter changes cleanly.

### Beat 3 — Search as a mode (40s)

Type in the search box. Filters visibly grey out with *"Filters are unavailable while searching."*

> "TMDB has no endpoint that does text search and structured filtering together — `/search`
> ignores genre and rating, `/discover` ignores the query. Rather than send parameters the API
> would silently discard, the app treats them as mutually exclusive modes and says so."

### Beat 4 — Debounce (30s) — *do this with the network tab open*

Clear the box. Type `batman` at normal speed. **One** request fires, after you stop.

> "One request instead of six, and no extra history entries — the URL write uses `replace`, so the
> back button doesn't walk out of a search one character at a time."

### Beat 5 — Cache sharing (30s)

Reload Home with the network tab open — three requests. Navigate to Movies, then Series.
**Zero new requests** for the first page.

> "One `queryOptions()` factory defines each query's key and fetcher together, so Home and the
> browse pages provably share a cache entry. Before that they fetched the same URL into two."

### Beat 6 — Persistence (20s)

Add two titles to the collection, go to Collections, **hard refresh**. Still there.

> "Zustand with persist. The store is versioned with a migration — without one, a version bump
> silently wipes everyone's saved data."

### Beat 7 — Resilience (30s, optional)

DevTools → throttle to Slow 3G, reload: skeletons matching content shape, then a progress bar on
navigation. Then go **offline** and change a page: an offline banner appears *above* the retained
grid rather than replacing it.

> "Stale data is still useful — it just needs labelling."

### Beat 8 — Under the hood (20s)

Show `src/hooks/queries.ts` or the `components/filters/` folder.

> "Four layers. `core/` is framework-free — plain functions, trivially testable. Components take
> props and own no server state."

---

## 4. Talking points

Short answers worth having ready.

**"What was the hardest bug?"**
Filters appeared wired correctly but returned unfiltered results. Everything upstream was right —
the URL, the query key, the parameter mapping. The endpoint was wrong: `/movie/popular` is a fixed
curated list that **silently discards** unknown parameters. Same request with and without filters
returned byte-identical results. Filtering needs `/discover`.

**"Why no Redux?"**
About 90% of the state is server state owned by TanStack Query. What's left is one array. Redux
would add a lot of ceremony for that.

**"How do you know the caching works?"**
Measured on a production build: Home fetches three URLs, then Movies and Series add zero.

**"What would you do differently?"**
Add Zod at the fetch boundary. Types are asserted, not verified — the code says so explicitly
rather than hiding it behind `any`, but an assertion is still a promise nobody checks.

**"What did you learn?"**
That "it looks right" and "it is right" are different claims. Several bugs here looked fine and
were caught by measuring — contrast ratios, request counts, cache key hashes.

---

## 5. Assets to capture for the site

Record at 1280×800 on the **production preview**, light theme.

1. **Hero still** — Home, scrolled to top
2. **Filter GIF** (~6s) — pick a genre + rating, URL visibly changing
3. **Search GIF** (~5s) — typing, filters greying out, results updating
4. **Network GIF** (~8s) — devtools open, typing `batman`, one request appearing
5. **Mobile still** — 390×844, Movies page with filters wrapped
6. **Code still** — `queries.ts` or `core/discoverParams.ts`

Suggested caption: *"React 19 · TanStack Query · URL-driven state · 80 tests"*

---

## 6. Deploying a live demo

Vercel or Netlify. Framework preset Vite, build `npm run build`, output `dist`.

Three things that will bite:

1. **Set `VITE_TMDB_API_KEY` in the host's environment settings.** The build inlines it.
2. **Use a read-only TMDB token.** It ships in the client bundle — unavoidable for a browser-only
   SPA. Say so if asked; it reads as awareness, not carelessness.
3. **Add an SPA rewrite, or deep links 404.** Without it, loading
   `/movies?genre=27` directly fails — which would break the single best demo beat.

   Netlify `_redirects`:
   ```
   /*  /index.html  200
   ```
   Vercel `vercel.json`:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```

**Verify after deploy:** open a filtered URL directly in a fresh tab. If it renders, rewrites work.

---

## 7. If picking development back up

Highest value first:

1. **Tests for the filter system.** `FilterBar.test.tsx` and `useFilterParams.test.tsx` hold 20
   `it.todo` entries written as a spec — implement against them.
2. **Zod at the fetch boundary.** The one architectural gap that's honestly acknowledged.
3. **Collections filtering.** The `FilterBar` is already decoupled from TMDB; Collections would
   filter a local array and prove the component is genuinely reusable.
4. **Performance**, if it ever matters: `preconnect` to both TMDB origins and a static shell in
   `index.html` are the two cheapest wins by a wide margin. Investigated and deliberately deferred
   — the app is fast enough on a normal connection.
