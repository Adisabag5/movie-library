import { useQuery } from '@tanstack/react-query';
import {
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

export function usePopularSeries() {
  return useQuery({
    queryKey: ['series', 'popular'],
    queryFn: fetchPopularSeries,
  });
}
