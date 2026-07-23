import { useSearchParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import PosterGrid from '../components/PosterGrid';
import { GridSkeleton } from '../components/Skeletons';
import { useMoviesPage } from '../hooks/queries';

// TMDB rejects page numbers above 500 even when total_pages is larger.
const MAX_PAGES = 500;

const Movies = () => {
  // The current page lives in the URL (?page=3), not in useState:
  // refresh keeps your place, back/forward moves between pages,
  // and the link is shareable.
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const { data, isPending, isError, isPlaceholderData } = useMoviesPage(page);

  const goToPage = (nextPage: number) => {
    setSearchParams({ page: String(nextPage) });
    window.scrollTo({ top: 0 });
  };

  if (isError) {
    return <ErrorMessage message="Could not load movies. Please try again later." />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Movies</h1>

      {isPending ? (
        <GridSkeleton />
      ) : (
        <>
          <PosterGrid list={data.results} dimmed={isPlaceholderData} />

          <Pagination
            page={page}
            totalPages={Math.min(data.total_pages, MAX_PAGES)}
            isBusy={isPlaceholderData}
            onPageChange={goToPage}
          />
        </>
      )}
    </div>
  );
};

export default Movies;
