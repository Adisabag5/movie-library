import { useSearchParams } from 'react-router-dom';
import { MAX_PAGES } from '../core/http';

const clampPage = (value: number) =>
  Math.min(MAX_PAGES, Math.max(1, Math.floor(value) || 1));

export function usePageParam() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Clamped on read as well as on write: `?page=600` can arrive from a
  // hand-typed URL or an old bookmark, and unclamped it reaches TMDB and
  // errors out.
  const page = clampPage(Number(searchParams.get('page')));

  const goToPage = (nextPage: number) => {
    // Functional update over a copy of the existing params. Passing an
    // object literal here replaces the entire query string, which would
    // silently drop any other parameter the page grows later (?genre=, ?q=).
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set('page', String(clampPage(nextPage)));
      return next;
    });
    window.scrollTo({ top: 0 });
  };

  return { page, goToPage };
}
