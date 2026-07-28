import Hero from '../components/Hero';
import HorizontalList from '../components/HorizontalList';
import { OfflineBanner } from '../components/ErrorMessage';
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

  const isPaused =
    popularMovies.isPaused || topRatedMovies.isPaused || popularSeries.isPaused;

  if (isPaused) {
    return <OfflineBanner />;
  }

  return (
    <div className="space-y-10">
      {
        popularMovies?.isPending ?
          <HeroSkeleton /> :
            popularMovies.isError ?
              <p className="rounded-2xl bg-sand/70 p-8 text-center font-semibold text-oxblood ring-1 ring-bark/50"> Could not load movies. Please try again later.</p> :
                <Hero movies={popularMovies.data} />
      }

      {
        popularMovies?.isPending ?
          <RowSkeleton /> :
            popularMovies.isError ?
                <p className="rounded-2xl bg-sand/70 p-8 text-center font-semibold text-oxblood ring-1 ring-bark/50"> Could not load movies. Please try again later.</p> :
                  <HorizontalList title="Movies" list={popularMovies.data} />
      }

      {
        popularSeries?.isPending ?
          <RowSkeleton /> :
              popularSeries.isError ?
                <p className="rounded-2xl bg-sand/70 p-8 text-center font-semibold text-oxblood ring-1 ring-bark/50"> Could not load series. Please try again later.</p> :
                  <HorizontalList title="Series" list={popularSeries.data} />
      }

      {
        topRatedMovies?.isPending ?
          <RowSkeleton /> :
              topRatedMovies.isError ?
                <p className="rounded-2xl bg-sand/70 p-8 text-center font-semibold text-oxblood ring-1 ring-bark/50"> Could not load movies. Please try again later.</p> :
                  <HorizontalList title="Top Rated" list={topRatedMovies.data} />
      }

    </div>
  );
};

export default Home;
