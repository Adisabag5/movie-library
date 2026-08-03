import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';
import {
  fetchDiscoverMovies,
  fetchDiscoverSeries,
  fetchMovieDetails,
  fetchPopularMovies,
  fetchPopularSeries,
  fetchSearchMovies,
  fetchSearchSeries,
  fetchSeriesDetails,
  fetchTopRatedMovies,
} from '../core/http';
import type { Paginated } from '../types/api';

const popularMoviesQuery = (page: number) =>
  queryOptions({
    queryKey: ['movies', 'popular', page],
    queryFn: ({ signal }) => fetchPopularMovies(page, signal),
  });

const discoverMoviesQuery = (page: number, query: string) =>
  queryOptions({
    queryKey: ['movies', 'discover', page, query],
    queryFn: ({ signal }) => fetchDiscoverMovies(page, query, signal),
  });

const searchMoviesQuery = (page: number, term: string) =>
  queryOptions({
    queryKey: ['movies', 'search', page, term],
    queryFn: ({ signal }) => fetchSearchMovies(page, term, signal),
  });

const searchSeriesQuery = (page: number, term: string) =>
  queryOptions({
    queryKey: ['series', 'search', page, term],
    queryFn: ({ signal }) => fetchSearchSeries(page, term, signal),
  });

const discoverSeriesQuery = (page: number, query: string) =>
  queryOptions({
    queryKey: ['series', 'discover', page, query],
    queryFn: ({ signal }) => fetchDiscoverSeries(page, query, signal),
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

// Three endpoints, one hook. Search wins when a term is present, because TMDB
// cannot honour filters and a text query in the same request. With neither, it
// stays on /popular, which keeps the curated ordering and keeps sharing Home's
// cache entry.
export function useMoviesPage(page: number, filterQuery = '', searchTerm = '') {
  const options = searchTerm
    ? searchMoviesQuery(page, searchTerm)
    : filterQuery
      ? discoverMoviesQuery(page, filterQuery)
      : popularMoviesQuery(page);

  return useQuery({ ...options, placeholderData: keepPreviousData });
}

export function useSeriesPage(page: number, filterQuery = '', searchTerm = '') {
  const options = searchTerm
    ? searchSeriesQuery(page, searchTerm)
    : filterQuery
      ? discoverSeriesQuery(page, filterQuery)
      : popularSeriesQuery(page);

  return useQuery({ ...options, placeholderData: keepPreviousData });
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
