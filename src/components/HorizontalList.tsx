import PosterCard from './PosterCard'
import { mediaKey, type MediaItem } from '../core/media'

const HorizontalList = ({ title, list }: { title: string; list: MediaItem[] }) => {

    return (
        <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">{ title }</h2>

            {/* overflow-x-auto + shrink-0 children = a horizontal scroller;
                snap-x makes swiping settle on card edges (mobile UX) */}
            <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
                {list.map((i) => (
                    <PosterCard key={mediaKey(i)} item={i} className="w-28 shrink-0 snap-start md:w-36" />
                ))}
            </div>
        </section>
    )
}

export default HorizontalList
