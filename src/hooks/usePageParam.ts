import { useSearchParams } from 'react-router-dom';

export function usePageParam() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const goToPage = (nextPage: number) => {
    setSearchParams({ page: String(nextPage) });
    window.scrollTo({ top: 0 });
  };

  return { page, goToPage };
}
