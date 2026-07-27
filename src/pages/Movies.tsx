import BrowsePage from '../components/BrowsePage';
import { useMoviesPage } from '../hooks/queries';
import { usePageParam } from '../hooks/usePageParam';

const Movies = () => {
  const { page, goToPage } = usePageParam();
  const query = useMoviesPage(page);

  return (
    <BrowsePage
      title="Movies"
      errorMessage="Could not load movies. Please try again later."
      query={query}
      onPageChange={goToPage}
    />
  );
};

export default Movies;
