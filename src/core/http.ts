import type { Paginated } from '../types/api';
import type { Movie, MovieDetails } from '../types/movie';
import type { Series, SeriesDetails } from '../types/series';

const BASE_URL = 'https://api.themoviedb.org/3';

export const MAX_PAGES = 500;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const HEADERS = {
  accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`,
};

/** Appends a filter query only when there is one, so no trailing '&'. */
const suffix = (query: string) => (query ? `&${query}` : '');

export class TmdbError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'TmdbError';
    this.status = status;
  }
}

async function fetchFromTmdb<T>(endpoint: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: HEADERS,
    signal,
  });

  if (!response.ok) {
    throw new TmdbError(response.status, `TMDB request failed (${response.status})`);
  }

  const data: unknown = await response.json();
  return data as T;
}

export function fetchPopularMovies(
  page: number,
  signal: AbortSignal
): Promise<Paginated<Movie>> {
  return fetchFromTmdb(`/movie/popular?language=en-US&page=${page}`, signal);
}

// /movie/popular and /tv/popular are fixed curated lists: they accept only
// language, page and region, and silently DISCARD anything else. Filtering has
// to go through /discover, which is a different endpoint with a different
// result set — passing with_genres to /popular returns the unfiltered list
// with no error at all.
export function fetchDiscoverMovies(
  page: number,
  query: string,
  signal: AbortSignal
): Promise<Paginated<Movie>> {
  return fetchFromTmdb(`/discover/movie?language=en-US&page=${page}${suffix(query)}`, signal);
}

export function fetchDiscoverSeries(
  page: number,
  query: string,
  signal: AbortSignal
): Promise<Paginated<Series>> {
  return fetchFromTmdb(`/discover/tv?language=en-US&page=${page}${suffix(query)}`, signal);
}

// /search takes a text query but ignores every /discover filter, and
// /discover ignores `query`. There is no endpoint that does both, which is why
// searching and filtering are mutually exclusive modes rather than combinable.
// The term is encoded because it is arbitrary user input — spaces, ampersands
// and question marks would otherwise corrupt the query string.
export function fetchSearchMovies(
  page: number,
  term: string,
  signal: AbortSignal
): Promise<Paginated<Movie>> {
  return fetchFromTmdb(
    `/search/movie?language=en-US&include_adult=false&page=${page}&query=${encodeURIComponent(term)}`,
    signal
  );
}

export function fetchSearchSeries(
  page: number,
  term: string,
  signal: AbortSignal
): Promise<Paginated<Series>> {
  return fetchFromTmdb(
    `/search/tv?language=en-US&include_adult=false&page=${page}&query=${encodeURIComponent(term)}`,
    signal
  );
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
