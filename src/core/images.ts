// One place for TMDB image URLs instead of string-concatenating
// the base URL in every component.
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

type ImageSize = 'w200' | 'w500' | 'w1280';

// TMDB returns null for titles with no artwork. Returning '' for those put
// `<img src="">` in the DOM, which re-requests the current page and renders
// a broken-image icon. An inline SVG data URI avoids both — no extra
// request, no asset file to lose, and it scales to whatever box holds it.
// 2:3 matches the poster aspect ratio so it never shifts the layout.
const PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 3"><rect width="2" height="3" fill="#27272a"/></svg>'
)}`;

export const imageUrl = (path: string | null, size: ImageSize = 'w200') =>
  path ? `${IMAGE_BASE}/${size}${path}` : PLACEHOLDER;
