
import { Outlet } from 'react-router-dom'
import Toolbar from '../components/Toolbar'

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-10">
        <header>
            <Toolbar />
        </header>

        <main>
             <Outlet />
        </main>
        
    </div>
  )
}

export default RootLayout