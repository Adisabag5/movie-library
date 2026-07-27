import type { Paginated } from '../types/api';
import type { Movie, MovieDetails } from '../types/movie';
import type { Series, SeriesDetails } from '../types/series';

const BASE_URL = 'https://api.themoviedb.org/3';

// TMDB rejects page numbers above 500 even when total_pages reports more.
// It lives here because it is a fact about the API, and both the pager and
// the URL parameter have to respect it.
export const MAX_PAGES = 500;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const HEADERS = {
  accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`,
};

// Carries the HTTP status so callers can tell "this id doesn't exist"
// (404, never worth retrying) from "the server is having a bad day"
// (5xx, worth retrying). A plain Error would bury that in a string.
export class TmdbError extends Error {
  // Declared and assigned explicitly rather than as a constructor
  // parameter property: this project sets erasableSyntaxOnly, which
  // bans TS syntax that emits runtime code.
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'TmdbError';
    this.status = status;
  }
}

// `signal` comes from TanStack Query and aborts the request when the
// query is cancelled or superseded, so responses the user has navigated
// away from never land. It is required, not optional: an optional
// parameter lets a call site silently drop cancellation, and it would
// widen the type to `AbortSignal | undefined` while RequestInit.signal
// is `AbortSignal | null`.
async function fetchFromTmdb<T>(endpoint: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: HEADERS,
    signal,
  });

  if (!response.ok) {
    throw new TmdbError(response.status, `TMDB request failed (${response.status})`);
  }

  // `.json()` is typed `any`, which would let the caller's `T` flow out
  // unchecked and invisible. Going through `unknown` forces the assertion
  // to be written down: this is the one place the app trusts TMDB to match
  // the interfaces in `src/types/`, and nothing verifies it at runtime.
  const data: unknown = await response.json();
  return data as T;
}

// Every list endpoint is paginated, so all of them take a page and return
// the whole envelope. Callers that only want the first page ask for page 1
// — that way the home page and the browse page share one cache entry
// instead of fetching the same URL under two different keys.
export function fetchPopularMovies(
  page: number,
  signal: AbortSignal
): Promise<Paginated<Movie>> {
  return fetchFromTmdb(`/movie/popular?language=en-US&page=${page}`, signal);
}

export function fetchTopRatedMovies(
  page: number,
  signal: AbortSignal
): Promise<Paginated<Movie>> {
  return fetchFromTmdb(`/movie/top_rated?language=en-US&page=${page}`, signal);
}

export function fetchPopularSeries(
  page: number,
  signal: AbortSignal
): Promise<Paginated<Series>> {
  return fetchFromTmdb(`/tv/popular?language=en-US&page=${page}`, signal);
}

export function fetchMovieDetails(
  id: string,
  signal: AbortSignal
): Promise<MovieDetails> {
  return fetchFromTmdb(`/movie/${id}?language=en-US`, signal);
}

export function fetchSeriesDetails(
  id: string,
  signal: AbortSignal
): Promise<SeriesDetails> {
  return fetchFromTmdb(`/tv/${id}?language=en-US`, signal);
}
