import { useQuery } from '@tanstack/react-query';
import {
  fetchMovieDetails,
  fetchPopularMovies,
  fetchPopularSeries,
  fetchTopRatedMovies,
} from '../core/http';

// Query keys identify each piece of server data in the cache.
// The convention is a readonly array from general to specific,
// e.g. ['movies', 'popular'] — later ['movies', 'details', id].
export function usePopularMovies() {
  return useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: fetchPopularMovies,
  });
}

export function useTopRatedMovies() {
  return useQuery({
    queryKey: ['movies', 'topRated'],
    queryFn: fetchTopRatedMovies,
  });
}

// The id becomes part of the query key, so every movie gets its own
// cache entry — visiting the same movie twice is served from cache.
export function useMovieDetails(id: string) {
  return useQuery({
    queryKey: ['movies', 'details', id],
    queryFn: () => fetchMovieDetails(id),
  });
}

export function usePopularSeries() {
  return useQuery({
    queryKey: ['series', 'popular'],
    queryFn: fetchPopularSeries,
  });
}
