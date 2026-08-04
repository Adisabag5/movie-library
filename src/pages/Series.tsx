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
import { useSeriesPage } from '../hooks/queries';
import { useFilterParams } from '../hooks/useFilterParams';
import { usePageParam } from '../hooks/usePageParam';
import { useSearchTerm } from '../hooks/useSearchTerm';

const Series = () => {
  const { page, goToPage } = usePageParam();
  const fields = buildFilterFields('tv');
  const { values, setFilter, reset } = useFilterParams({ fields });
  const { term, setTerm } = useSearchTerm();

  const isSearching = term !== '';

  const { data, isPending, isError, isPaused, isPlaceholderData, refetch } = useSeriesPage(
    page,
    isSearching ? '' : toDiscoverQuery(values, 'tv'),
    term
  );


  if (isError) {
    return (
      <ErrorMessage
        message="Could not load series. Please try again later."
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <title>Series — Movie Library</title>

      <h1 className="text-2xl font-bold tracking-tight">Series</h1>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput value={term} onChange={setTerm} placeholder="Search series" isBusy={isPlaceholderData} />

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

export default Series;
