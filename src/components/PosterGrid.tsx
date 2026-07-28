import PosterCard from './PosterCard'
import { mediaKey, type MediaItem } from '../core/media'

const PosterGrid = ({ list, dimmed = false }: { list: MediaItem[]; dimmed?: boolean }) => {
    return (
        <div
            className={`grid grid-cols-3 gap-4 transition-opacity sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 ${
                dimmed ? 'opacity-50' : ''
            }`}
        >
            {list.map((item) => (
                <PosterCard key={mediaKey(item)} item={item} />
            ))}
        </div>
    )
}

export default PosterGrid
