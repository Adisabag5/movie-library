import type { Movie } from '../types/movie';
import type { Series } from '../types/series';

export type MediaItem = Movie | Series;

export const isMovie = (item: MediaItem): item is Movie => 'title' in item;

export const displayName = (item: MediaItem) =>
  isMovie(item) ? item.title : item.name;

export const detailsPath = (item: MediaItem) =>
  isMovie(item) ? `/movie/${item.id}` : `/series/${item.id}`;

export const mediaKey = (item: MediaItem) =>
  isMovie(item) ? `movie-${item.id}` : `tv-${item.id}`;
