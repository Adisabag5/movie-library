import { useState } from 'react';
import { Link } from 'react-router-dom';
import { imageUrl } from '../core/images';
import type { Movie } from '../types/movie';

const Hero = ( { movies }: { movies: Movie[] } ) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const selectedMovie = movies.find((m) => m.id === selectedId) ?? movies[0];

    if (!selectedMovie) return null;

    const { id, title, backdrop_path, poster_path, vote_average, overview, release_date } = selectedMovie;

    return(
        <section className="relative overflow-hidden rounded-[2rem] bg-sand shadow-2xl shadow-ink/25 ring-1 ring-bark/50">

            <img
                src={imageUrl(backdrop_path ?? poster_path, 'w1280')}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/85 to-paper/15" />
            <div className="absolute inset-0 animate-drift bg-[linear-gradient(115deg,var(--color-marigold),transparent_45%,var(--color-clay))] bg-[length:200%_200%] opacity-30 mix-blend-soft-light" />

            <div className="relative flex min-h-[30rem] flex-col justify-end gap-4 p-5 md:min-h-[34rem] md:p-10">
                <div className="max-w-2xl space-y-3">
                    <p className="animate-fade-up text-xs font-black uppercase tracking-[0.2em] text-clay-deep" style={{ animationDelay: '60ms' }}>
                        Featured
                    </p>

                    <h2 className="animate-fade-up text-4xl font-black leading-[1.05] tracking-tight text-ink md:text-6xl" style={{ animationDelay: '120ms' }}>
                        {title}
                    </h2>

                    <div className="flex animate-fade-up items-center gap-3 text-sm text-ink-soft" style={{ animationDelay: '180ms' }}>
                        <span className="rounded-full bg-clay px-2.5 py-0.5 font-bold text-paper">
                            ★ {vote_average.toFixed(1)}
                        </span>
                        <span className="font-semibold">{release_date.slice(0, 4)}</span>
                    </div>

                    <p className="line-clamp-3 animate-fade-up text-sm font-medium leading-relaxed text-ink/85 md:text-base" style={{ animationDelay: '240ms' }}>
                        {overview}
                    </p>
                </div>

                <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
                    <Link
                        to={`/movie/${id}`}
                        className="group inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3 font-bold text-paper shadow-lg shadow-clay/40 transition-all duration-300 hover:-translate-y-0.5 hover:bg-marigold hover:text-ink hover:shadow-xl hover:shadow-marigold/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
                    >
                        Details
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                </div>

                <div
                    className="-mx-1 mt-2 animate-fade-up rounded-2xl border border-bark/50 bg-paper/60 p-2.5 shadow-lg shadow-ink/10 backdrop-blur-md"
                    style={{ animationDelay: '360ms' }}
                >

                    <div className="scroll-rail flex snap-x gap-3 overflow-x-auto px-0.5 py-3">
                        {movies.map((m) => {
                            const isSelected = m.id === selectedMovie.id;
                            return (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setSelectedId(m.id)}
                                    aria-label={`Show ${m.title}`}
                                    aria-pressed={isSelected}
                                    className={`group relative shrink-0 snap-start overflow-hidden rounded-xl transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay ${
                                        isSelected
                                            ? '-translate-y-1 shadow-lg shadow-clay/40 ring-2 ring-clay'
                                            : 'opacity-70 hover:-translate-y-1 hover:opacity-100'
                                    }`}
                                >
                                    <img
                                        src={imageUrl(m.poster_path)}
                                        alt={m.title}
                                        loading="lazy"
                                        className={`h-24 w-16 object-cover transition-all duration-300 ${
                                            isSelected ? 'brightness-110' : 'brightness-90 group-hover:brightness-125'
                                        }`}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero;
