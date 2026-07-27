import { useState } from 'react';
import { Link } from 'react-router-dom';
import { imageUrl } from '../core/images';
import type { Movie } from '../types/movie';

const Hero = ( { movies }: { movies: Movie[] } ) => {
    // Store only the id and derive the movie during render. Copying the
    // whole object into state would freeze it at first render: when the
    // list refetches, state would still point at an item from the old
    // array — possibly one that is no longer in the list at all.
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const selectedMovie = movies.find((m) => m.id === selectedId) ?? movies[0];

    // The caller may hand us an empty list (a filtered or failed response).
    if (!selectedMovie) return null;

    const { id, title, backdrop_path, poster_path, vote_average, overview, release_date } = selectedMovie;

    return(
        <section className="relative overflow-hidden rounded-2xl bg-zinc-900 shadow-lg">
            {/* Backdrop image with a gradient on top so text stays readable */}
            <img
                src={imageUrl(backdrop_path ?? poster_path, 'w1280')}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

            {/* Content sits above the backdrop (relative beats absolute) */}
            <div className="relative flex min-h-[24rem] flex-col justify-end gap-3 p-5 md:min-h-[28rem] md:p-10">
                <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>

                <p className="text-sm text-zinc-300">
                    {release_date.slice(0, 4)} · ★ {vote_average.toFixed(1)}
                </p>

                <p className="line-clamp-3 max-w-2xl text-sm leading-relaxed text-zinc-300 md:text-base">
                    {overview}
                </p>

                <div>
                    <Link
                        to={`/movie/${id}`}
                        className="inline-block rounded-lg bg-red-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                    >
                        Details
                    </Link>
                </div>

                {/* carousel */}
                <div className="-mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-1">
                    {movies.map((m) => (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => setSelectedId(m.id)}
                            className={`shrink-0 overflow-hidden rounded-lg transition ${
                                m.id === selectedMovie.id ? 'ring-2 ring-red-600' : 'opacity-60 hover:opacity-100'
                            }`}
                        >
                            <img
                                src={imageUrl(m.poster_path)}
                                alt={m.title}
                                loading="lazy"
                                className="h-24 w-16 object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Hero;
