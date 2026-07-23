import { Outlet } from 'react-router-dom'
import Toolbar from '../components/Toolbar'

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
        {/* sticky + backdrop-blur: the nav stays readable over content
            scrolling underneath it */}
        <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 py-3 md:px-6">
                <Toolbar />
            </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
             <Outlet />
        </main>
    </div>
  )
}

export default RootLayout
