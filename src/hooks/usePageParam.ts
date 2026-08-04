import { MAX_PAGES } from '../core/http';
import { PAGE_KEY, useUrlParams } from './useUrlParams';

const clampPage = (value: number) =>
  Math.min(MAX_PAGES, Math.max(1, Math.floor(value) || 1));

export function usePageParam() {
  const { searchParams, update } = useUrlParams();

  const page = clampPage(Number(searchParams.get(PAGE_KEY)));

  const goToPage = (nextPage: number) => {
    update((next) => next.set(PAGE_KEY, String(clampPage(nextPage))), { keepPage: true });
  };

  return { page, goToPage };
}
