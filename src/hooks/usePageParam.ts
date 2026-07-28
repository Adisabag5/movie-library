import { useSearchParams } from 'react-router-dom';
import { MAX_PAGES } from '../core/http';

const clampPage = (value: number) =>
  Math.min(MAX_PAGES, Math.max(1, Math.floor(value) || 1));

export function usePageParam() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = clampPage(Number(searchParams.get('page')));

  const goToPage = (nextPage: number) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set('page', String(clampPage(nextPage)));
      return next;
    });
  };

  return { page, goToPage };
}
