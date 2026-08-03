import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
        <title>Not found — Movie Library</title>

        <h1 className="text-6xl font-black tracking-tight text-ink">404</h1>

        <p className="text-lg font-medium text-ink-soft">This page doesn&apos;t exist.</p>

        <Link
          to="/"
          className="mt-2 rounded-full bg-accent px-6 py-2.5 font-bold text-paper shadow-lg shadow-accent/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Back to Home
        </Link>
    </div>
  )
}

export default PageNotFound
