import { useSearchParams } from 'react-router-dom';

// Shared by every paginated browse page: reads the current page from
// the URL (?page=3) and returns a setter that updates it. Custom hooks
// are how React lets you reuse *stateful* logic between components.
export function usePageParam() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL input is user input — clamp anything weird back to 1.
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const goToPage = (nextPage: number) => {
    setSearchParams({ page: String(nextPage) });
    window.scrollTo({ top: 0 });
  };

  return { page, goToPage };
}
