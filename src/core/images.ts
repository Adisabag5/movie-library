// One place for TMDB image URLs instead of string-concatenating
// the base URL in every component.
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

type ImageSize = 'w200' | 'w500' | 'w1280';

export const imageUrl = (path: string | null, size: ImageSize = 'w200') =>
  path ? `${IMAGE_BASE}/${size}${path}` : '';
