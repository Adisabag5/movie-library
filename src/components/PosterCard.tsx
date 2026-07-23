import { Link } from 'react-router-dom'
import type { Movie } from '../types/movie'
import type { Series } from '../types/series'

// Movies have `title`, series have `name` — the `in` check tells
// TypeScript which of the two we are holding (union narrowing).
const displayName = (item: Movie | Series) =>
    'title' in item ? item.title : item.name

const detailsPath = (item: Movie | Series) =>
    'title' in item ? `/movie/${item.id}` : `/series/${item.id}`

// One poster card, two layouts: HorizontalList passes fixed widths,
// the browse grids let the grid column set the width.
const PosterCard = ({ item, className = '' }: { item: Movie | Series; className?: string }) => {
    return (
        <Link
            to={detailsPath(item)}
            className={`group rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${className}`}
        >
            <div className="overflow-hidden rounded-lg">
                <img
                    src={'https://image.tmdb.org/t/p/w200' + item.poster_path}
                    alt={displayName(item)}
                    loading="lazy"
                    className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
                />
            </div>
            <p className="mt-2 truncate text-sm text-zinc-400 transition-colors group-hover:text-zinc-200">
                {displayName(item)}
            </p>
        </Link>
    )
}

export default PosterCard
