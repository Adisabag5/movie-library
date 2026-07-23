import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import HorizontalList from '../components/HorizontalList';
import { fetchPopularMovies, fetchTopRatedMovies, type Movie } from '../core/http';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Guards against updating state after the component has unmounted
    // (and against the double-run of effects in dev StrictMode).
    let ignore = false;

    const loadMovies = async () => {
      try {
        // Both requests are independent, so run them in parallel
        // instead of awaiting one after the other.
        const [popular, topRated] = await Promise.all([
          fetchPopularMovies(),
          fetchTopRatedMovies(),
        ]);

        if (!ignore) {
          setPopularMovies(popular);
          setTopRatedMovies(topRated);
        }
      } catch (error) {
        console.error(error);
        if (!ignore) setErrorMessage('Could not load movies. Please try again later.');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return <p className="p-8 text-center text-zinc-400">Loading…</p>;
  }

  if (errorMessage) {
    return <p className="p-8 text-center text-red-500">{errorMessage}</p>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      {popularMovies.length > 0 && <Hero movies={popularMovies} />}

      <HorizontalList title="Movies" list={popularMovies} />

      <HorizontalList title="Top Rated" list={topRatedMovies} />
    </div>
  );
};

export default Home;
