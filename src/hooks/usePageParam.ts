import { MAX_PAGES } from '../core/http';
import { PAGE_KEY, useUrlParams } from './useUrlParams';

const clampPage = (value: number) =>
  Math.min(MAX_PAGES, Math.max(1, Math.floor(value) || 1));

export function usePageParam() {
  const { searchParams, update } = useUrlParams();

  // Clamped on read as well as on write: ?page=600 can arrive from a
  // hand-typed URL or an old bookmark, and unclamped it reaches TMDB and
  // errors out.
  const page = clampPage(Number(searchParams.get(PAGE_KEY)));

  // The one caller that keeps the page — it is the thing setting it.
  const goToPage = (nextPage: number) => {
    update((next) => next.set(PAGE_KEY, String(clampPage(nextPage))), { keepPage: true });
  };

  return { page, goToPage };
}
