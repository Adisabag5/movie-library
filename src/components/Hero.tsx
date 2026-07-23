import { useState } from 'react';
import type { Movie } from '../core/http';

const Hero = ( { movies }: { movies: Movie[] } ) => {
    const [selectedMovie, setSelectedMovie] = useState<Movie>(movies[0]);
    const { title, poster_path, vote_average, overview } = selectedMovie;
    return(
        <section className="flex flex-col gap-6 rounded-2xl bg-zinc-900 p-8 shadow-lg md:flex-row md:items-center">
            <div className="item-data flex-1 space-y-3">
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                <p className="text-zinc-400 leading-relaxed">{overview}</p>
                <p className="text-zinc-400 leading-relaxed">{vote_average}</p>
                <button className="mt-2 rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition-colors hover:bg-red-700">
                    Watch
                </button>
            </div>

            <img src={'https://image.tmdb.org/t/p/w500' + poster_path} alt="" />

            {/* carousel */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                  {movies.map((m) => (
                      <button
                          key={m.id}
                          onClick={() => setSelectedMovie(m)}
                          className={`shrink-0 rounded-lg transition ${
                              m.id === selectedMovie.id ? 'ring-2 ring-red-600' : 'opacity-70 hover:opacity-100'
                          }`}
                      >
                          <img
                              src={'https://image.tmdb.org/t/p/w200' + m.poster_path}
                              alt={m.title}
                              className="h-32 w-20 rounded-lg object-cover"
                          />
                      </button>
                  ))}
              </div>
        </section>
    )
}

export default Hero;

