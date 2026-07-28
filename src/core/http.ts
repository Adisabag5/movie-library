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
