import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SocialLinks from '../components/SocialLinks';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-zinc-100 selection:bg-primary/30 selection:text-white overflow-x-hidden">
            <Navbar />
            <main className="flex-grow pt-16">
                <Outlet />
            </main>
            <footer className="bg-surface border-t border-white/5 py-8 mt-20">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-zinc-500 text-sm">
                    <span>© {new Date().getFullYear()} Diego Bazán</span>
                    <SocialLinks />
                </div>
            </footer>
        </div>
    )
}
