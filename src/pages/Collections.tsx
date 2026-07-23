import { Link } from 'react-router-dom'
import PosterGrid from '../components/PosterGrid'
import { useCollection } from '../stores/collection'

const Collections = () => {
  const items = useCollection((state) => state.items)

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">My Collection</h1>

      {items.length === 0 ? (
        <div className="space-y-3 py-24 text-center text-zinc-500">
          <p>Your collection is empty.</p>
          <p className="text-sm">
            Browse{' '}
            <Link to="/movies" className="text-zinc-300 underline hover:text-white">
              movies
            </Link>{' '}
            or{' '}
            <Link to="/series" className="text-zinc-300 underline hover:text-white">
              series
            </Link>{' '}
            and hit the + button on anything you like.
          </p>
        </div>
      ) : (
        <PosterGrid list={items} />
      )}
    </div>
  )
}

export default Collections
