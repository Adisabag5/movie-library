import type { Movie } from '../core/http'

const HorizontalList = ({ title, list }: { title: string; list: Movie[] }) => {

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
                            alt={i.title}
                            className="h-32 w-20 rounded-lg object-cover"
                        />
                    </button>
                ))}
            </div>
        </section>
    )
}

export default HorizontalList