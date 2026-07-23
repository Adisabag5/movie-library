export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS: RequestInit = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

// Generic helper: every TMDB call shares the same base URL, headers and
// error handling, so we write that once. <T> lets each caller declare the
// shape of the JSON it expects back.
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
