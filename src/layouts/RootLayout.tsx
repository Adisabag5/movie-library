import { Outlet, ScrollRestoration, useNavigation } from 'react-router-dom'
import Toolbar from '../components/Toolbar'
import Footer from '../components/Footer'

const RootLayout = () => {
  const navigation = useNavigation()
  const isNavigating = navigation.state !== 'idle'

  return (
    <div className="flex min-h-screen flex-col text-ink">

        {isNavigating && (
            <div
                role="progressbar"
                aria-label="Loading page"
                className="fixed inset-x-0 top-0 z-[60] h-1 animate-drift bg-[linear-gradient(110deg,var(--color-clay),var(--color-marigold),var(--color-clay))] bg-[length:200%_100%]"
            />
        )}

        <header className="sticky top-0 z-50 border-b border-bark/60 bg-paper/80 backdrop-blur-md">
            <div className="mx-auto max-w-6xl px-4 py-3 md:px-6">
                <Toolbar />
            </div>
        </header>

        <main aria-busy={isNavigating} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6">
             <ScrollRestoration />
             <Outlet />
        </main>

        <Footer />
    </div>
  )
}

export default RootLayout
