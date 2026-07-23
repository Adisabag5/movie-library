import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  fetchMovieDetails,
  fetchMoviesPage,
  fetchPopularMovies,
  fetchPopularSeries,
  fetchSeriesDetails,
  fetchSeriesPage,
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

export function useMoviesPage(page: number) {
  return useQuery({
    queryKey: ['movies', 'list', page],
    queryFn: () => fetchMoviesPage(page),
    placeholderData: keepPreviousData,
  });
}

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

export function useSeriesDetails(id: string) {
  return useQuery({
    queryKey: ['series', 'details', id],
    queryFn: () => fetchSeriesDetails(id)
  })
}

export function useSeriesPage(page: number) {
  return useQuery({
    queryKey: ['series', 'list', page],
    queryFn: () => fetchSeriesPage(page),
    placeholderData: keepPreviousData
  })
}
