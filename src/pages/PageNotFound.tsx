import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
        <h2 className="text-6xl font-bold text-zinc-700">404</h2>
        <p className="text-lg text-zinc-400">This page doesn't exist.</p>
        <Link
          to="/"
          className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition-colors hover:bg-red-700"
        >
          Back to Home
        </Link>
    </div>
  )
}

export default PageNotFound
