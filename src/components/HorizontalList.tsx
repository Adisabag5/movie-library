import { Link } from 'react-router-dom'
import type { Movie, Series } from '../core/http'

// Movies have `title`, series have `name` — the `in` check tells
// TypeScript which of the two we are holding (union narrowing).
const displayName = (item: Movie | Series) =>
    'title' in item ? item.title : item.name

const detailsPath = (item: Movie | Series) =>
    'title' in item ? `/movie/${item.id}` : `/series/${item.id}`

const HorizontalList = ({ title, list }: { title: string; list: (Movie | Series)[] }) => {

    return (
        <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">{ title }</h2>

            {/* overflow-x-auto + shrink-0 children = a horizontal scroller;
                snap-x makes swiping settle on card edges (mobile UX) */}
            <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
                {list.map((i) => (
                    <Link
                        key={i.id}
                        to={detailsPath(i)}
                        className="group w-28 shrink-0 snap-start rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 md:w-36"
                    >
                        <div className="overflow-hidden rounded-lg">
                            <img
                                src={'https://image.tmdb.org/t/p/w200' + i.poster_path}
                                alt={displayName(i)}
                                loading="lazy"
                                className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                        </div>
                        <p className="mt-2 truncate text-sm text-zinc-400 transition-colors group-hover:text-zinc-200">
                            {displayName(i)}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default HorizontalList
