import BrowsePage from '../components/BrowsePage';
import { useSeriesPage } from '../hooks/queries';
import { usePageParam } from '../hooks/usePageParam';

const Series = () => {
  const { page, goToPage } = usePageParam();
  const query = useSeriesPage(page);

  return (
    <BrowsePage
      title="Series"
      errorMessage="Could not load series. Please try again later."
      query={query}
      onPageChange={goToPage}
    />
  );
};

export default Series;
