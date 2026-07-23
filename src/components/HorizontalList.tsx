import type { Movie, Series } from '../core/http'

// Movies have `title`, series have `name` — the `in` check tells
// TypeScript which of the two we are holding (union narrowing).
const displayName = (item: Movie | Series) =>
    'title' in item ? item.title : item.name

const HorizontalList = ({ title, list }: { title: string; list: (Movie | Series)[] }) => {

    return (
        <section>
            <div>
                <h2>{ title }</h2>
            </div>

            <div className="list">
                {list.map((i) => (
                    <button
                        key={i.id}
                        onClick={() => {return;}}
                        className={'shrink-0 rounded-lg transition'}
                    >
                        <img
                            src={'https://image.tmdb.org/t/p/w200' + i.poster_path}
                            alt={displayName(i)}
                            className="h-32 w-20 rounded-lg object-cover"
                        />
                    </button>
                ))}
            </div>
        </section>
    )
}

export default HorizontalList
