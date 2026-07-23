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

async function fetchFromTmdb<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, API_OPTIONS);

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}`);
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

// Unlike the home-page helpers, the browse page needs the whole
// envelope (total_pages drives the pagination controls), so this
// one returns Paginated<Movie> instead of unwrapping results.
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
