const IMAGE_BASE = 'https://image.tmdb.org/t/p';

type ImageSize = 'w200' | 'w500' | 'w1280';

const PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 3"><rect width="2" height="3" fill="#f0ede5"/></svg>'
)}`;

export const imageUrl = (path: string | null, size: ImageSize = 'w200') =>
  path ? `${IMAGE_BASE}/${size}${path}` : PLACEHOLDER;
