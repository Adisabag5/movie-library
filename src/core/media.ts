import type { Movie } from '../types/movie';
import type { Series } from '../types/series';

export type MediaItem = Movie | Series;

// Movies have `title`, series have `name` — the `in` check tells
// TypeScript which of the two we are holding (union narrowing).
export const isMovie = (item: MediaItem): item is Movie => 'title' in item;

export const displayName = (item: MediaItem) =>
  isMovie(item) ? item.title : item.name;

export const detailsPath = (item: MediaItem) =>
  isMovie(item) ? `/movie/${item.id}` : `/series/${item.id}`;

// TMDB movie ids and tv ids are separate namespaces — movie 123 and
// tv 123 are different things — so a unique key needs both parts.
export const mediaKey = (item: MediaItem) =>
  isMovie(item) ? `movie-${item.id}` : `tv-${item.id}`;
