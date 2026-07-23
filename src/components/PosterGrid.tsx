import PosterCard from './PosterCard'
import type { Movie } from '../types/movie'
import type { Series } from '../types/series'

// `dimmed` is set while a paginated query shows placeholder data.
const PosterGrid = ({ list, dimmed = false }: { list: (Movie | Series)[]; dimmed?: boolean }) => {
    return (
        <div
            className={`grid grid-cols-3 gap-4 transition-opacity sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 ${
                dimmed ? 'opacity-50' : ''
            }`}
        >
            {list.map((item) => (
                <PosterCard key={item.id} item={item} />
            ))}
        </div>
    )
}

export default PosterGrid
