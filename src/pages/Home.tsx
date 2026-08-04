import Hero from '../components/Hero';
import HorizontalList from '../components/HorizontalList';
import { OfflineBanner } from '../components/ErrorMessage';
import QueryState from '../components/QueryState';
import { HeroSkeleton, RowSkeleton } from '../components/Skeletons';
import Reveal from '../components/motion/Reveal';
import {
  usePopularMovies,
  usePopularSeries,
  useTopRatedMovies,
} from '../hooks/queries';

const Home = () => {
  const popularMovies = usePopularMovies();
  const topRatedMovies = useTopRatedMovies();
  const popularSeries = usePopularSeries();
  const isPaused = popularMovies.isPaused || topRatedMovies.isPaused || popularSeries.isPaused;

  return (
    <div className="space-y-10">
      <title>Movie Library — Browse films and series</title>

      <h1 className="sr-only">Movie Library — browse popular films and series</h1>

      {isPaused && <OfflineBanner />}

      <QueryState
        query={popularMovies}
        skeleton={<HeroSkeleton />}
        errorMessage="Could not load the featured film."
      >
        {(movies) => (
          <Reveal>
            <Hero movies={movies} />
          </Reveal>
        )}
      </QueryState>

      <QueryState
        query={popularMovies}
        skeleton={<RowSkeleton />}
        errorMessage="Could not load movies."
      >
        {(movies) => (
          <Reveal>
            <HorizontalList title="Movies" list={movies} />
          </Reveal>
        )}
      </QueryState>

      <QueryState
        query={popularSeries}
        skeleton={<RowSkeleton />}
        errorMessage="Could not load series."
      >
        {(series) => (
          <Reveal delay={80}>
            <HorizontalList title="Series" list={series} />
          </Reveal>
        )}
      </QueryState>

      <QueryState
        query={topRatedMovies}
        skeleton={<RowSkeleton />}
        errorMessage="Could not load top rated movies."
      >
        {(movies) => (
          <Reveal delay={160}>
            <HorizontalList title="Top Rated" list={movies} />
          </Reveal>
        )}
      </QueryState>
    </div>
  );
};

export default Home;
