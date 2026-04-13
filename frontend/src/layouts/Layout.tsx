import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
// Footer can be added later

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-zinc-100 selection:bg-primary/30 selection:text-white overflow-x-hidden">
            <Navbar />
            <main className="flex-grow pt-16">
                <Outlet />
            </main>
            <footer className="bg-surface border-t border-white/5 py-8 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center text-zinc-500 text-sm">
                    © {new Date().getFullYear()} Built with React & FastAPI.
                </div>
            </footer>
        </div>
    )
}
