import type { Paginated } from '../types/api';
import type { Movie, MovieDetails } from '../types/movie';
import type { Series, SeriesDetails } from '../types/series';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS: RequestInit = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
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

async function fetchFromTmdb<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, API_OPTIONS);

  if (!response.ok) {
    throw new TmdbError(response.status, `TMDB request failed (${response.status})`);
  }

  return response.json();
}

export async function fetchPopularMovies(): Promise<Movie[]> {
  const data = await fetchFromTmdb<{ results: Movie[] }>(
    '/movie/popular?language=en-US&page=1'
  );
  return data.results;
}

export async function fetchTopRatedMovies(): Promise<Movie[]> {
  const data = await fetchFromTmdb<{ results: Movie[] }>(
    '/movie/top_rated?language=en-US&page=1'
  );
  return data.results;
}

export async function fetchMoviesPage(page: number): Promise<Paginated<Movie>> {
  return fetchFromTmdb<Paginated<Movie>>(
    `/movie/popular?language=en-US&page=${page}`
  );
}

export async function fetchMovieDetails(id: string): Promise<MovieDetails> {
  return fetchFromTmdb<MovieDetails>(`/movie/${id}?language=en-US`);
}

export async function fetchPopularSeries(): Promise<Series[]> {
  const data = await fetchFromTmdb<{ results: Series[] }>(
    '/tv/popular?language=en-US&page=1'
  );
  return data.results;
}

export async function fetchSeriesDetails(id: string): Promise<SeriesDetails> {
  return fetchFromTmdb<SeriesDetails>(`/tv/${id}?language=en-US`);
}

export async function fetchSeriesPage(page: number): Promise<Paginated<Series>> {
  return fetchFromTmdb<Paginated<Series>>(
    `/tv/popular?language=en-US&page=${page}`
  );
}
