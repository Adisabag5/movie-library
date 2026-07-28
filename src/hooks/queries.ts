import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';
import {
  fetchMovieDetails,
  fetchPopularMovies,
  fetchPopularSeries,
  fetchSeriesDetails,
  fetchTopRatedMovies,
} from '../core/http';
import type { Paginated } from '../types/api';

const popularMoviesQuery = (page: number) =>
  queryOptions({
    queryKey: ['movies', 'popular', page],
    queryFn: ({ signal }) => fetchPopularMovies(page, signal),
  });

const topRatedMoviesQuery = (page: number) =>
  queryOptions({
    queryKey: ['movies', 'topRated', page],
    queryFn: ({ signal }) => fetchTopRatedMovies(page, signal),
  });

const popularSeriesQuery = (page: number) =>
  queryOptions({
    queryKey: ['series', 'popular', page],
    queryFn: ({ signal }) => fetchPopularSeries(page, signal),
  });

const movieDetailsQuery = (id: string) =>
  queryOptions({
    queryKey: ['movies', 'details', id],
    queryFn: ({ signal }) => fetchMovieDetails(id, signal),
  });

const seriesDetailsQuery = (id: string) =>
  queryOptions({
    queryKey: ['series', 'details', id],
    queryFn: ({ signal }) => fetchSeriesDetails(id, signal),
  });

export function useMoviesPage(page: number) {
  return useQuery({ ...popularMoviesQuery(page), placeholderData: keepPreviousData });
}

export function useSeriesPage(page: number) {
  return useQuery({ ...popularSeriesQuery(page), placeholderData: keepPreviousData });
}

const toResults = <T,>(data: Paginated<T>) => data.results;

export function usePopularMovies() {
  return useQuery({ ...popularMoviesQuery(1), select: toResults });
}

export function useTopRatedMovies() {
  return useQuery({ ...topRatedMoviesQuery(1), select: toResults });
}

export function usePopularSeries() {
  return useQuery({ ...popularSeriesQuery(1), select: toResults });
}

export function useMovieDetails(id: string) {
  return useQuery(movieDetailsQuery(id));
}

export function useSeriesDetails(id: string) {
  return useQuery(seriesDetailsQuery(id));
}
