import Hero from '../components/Hero';
import HorizontalList from '../components/HorizontalList';
import { HeroSkeleton, RowSkeleton } from '../components/Skeletons';
import {
  usePopularMovies,
  usePopularSeries,
  useTopRatedMovies,
} from '../hooks/queries';

const Home = () => {
  const popularMovies = usePopularMovies();
  const topRatedMovies = useTopRatedMovies();
  const popularSeries = usePopularSeries();

  const isPending =
    popularMovies.isPending || topRatedMovies.isPending || popularSeries.isPending;
  const isError =
    popularMovies.isError || topRatedMovies.isError || popularSeries.isError;

  if (isPending) {
    return (
      <div className="space-y-10">
        <HeroSkeleton />
        <RowSkeleton />
        <RowSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="p-8 text-center text-red-500">
        Could not load movies. Please try again later.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <Hero movies={popularMovies.data} />

      <HorizontalList title="Movies" list={popularMovies.data} />

      <HorizontalList title="Series" list={popularSeries.data} />

      <HorizontalList title="Top Rated" list={topRatedMovies.data} />
    </div>
  );
};

export default Home;
