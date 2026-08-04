import ErrorMessage, { OfflineBanner } from '../components/ErrorMessage';
import FilterBar from '../components/filters/FilterBar';
import SearchInput from '../components/filters/SearchInput';
import Pagination from '../components/Pagination';
import PosterGrid from '../components/PosterGrid';
import { GridSkeleton } from '../components/Skeletons';
import Reveal from '../components/motion/Reveal';
import { toDiscoverQuery } from '../core/discoverParams';
import { buildFilterFields } from '../core/filters';
import { MAX_PAGES } from '../core/http';
import { useMoviesPage } from '../hooks/queries';
import { useFilterParams } from '../hooks/useFilterParams';
import { usePageParam } from '../hooks/usePageParam';
import { useSearchTerm } from '../hooks/useSearchTerm';

const Movies = () => {
  const { page, goToPage } = usePageParam();
  const fields = buildFilterFields('movie');
  const { values, setFilter, reset } = useFilterParams({ fields });
  const { term, setTerm } = useSearchTerm();

  // Searching and filtering are mutually exclusive on TMDB, so the filter
  // query is dropped while a term is present rather than sent and ignored.
  const isSearching = term !== '';

  const { data, isPending, isError, isPaused, isPlaceholderData, refetch } = useMoviesPage(
    page,
    isSearching ? '' : toDiscoverQuery(values, 'movie'),
    term
  );


  if (isError) {
    return (
      <ErrorMessage
        message="Could not load movies. Please try again later."
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <title>Movies — Movie Library</title>

      <h1 className="text-2xl font-bold tracking-tight">Movies</h1>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput value={term} onChange={setTerm} placeholder="Search movies" isBusy={isPlaceholderData} />

        <FilterBar
          values={values}
          onChange={setFilter}
          fields={fields}
          onReset={reset}
          isBusy={isPlaceholderData}
          isDisabled={isSearching}
          disabledHint="Filters are unavailable while searching"
        />
      </div>


      {isPaused && <OfflineBanner />}

      {isPending && !isPaused && <GridSkeleton />}

      {!isPending && (
        <>
          <Reveal>
            <PosterGrid list={data.results} dimmed={isPlaceholderData} />
          </Reveal>

          <Pagination
            page={data.page}
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
