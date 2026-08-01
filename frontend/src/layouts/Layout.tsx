import { Link, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { STATIC_ROUTES } from '../utils/routeMappings';

export default function Layout() {
    const { t, language } = useLanguage();

    // Same source as the navbar, so the two never drift apart
    const footerLinks = [
        { name: t('home'), path: STATIC_ROUTES.home[language] },
        { name: t('about'), path: STATIC_ROUTES.about[language] },
        { name: t('projects'), path: STATIC_ROUTES.projects[language] },
        { name: t('blog'), path: STATIC_ROUTES.blog[language] },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background text-zinc-100 selection:bg-primary/30 selection:text-white overflow-x-hidden">
            <Navbar />
            <main className="flex-grow pt-16">
                <Outlet />
            </main>
            <footer className="bg-surface border-t border-white/5 py-8 mt-20">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-sm">
                    <span>© {new Date().getFullYear()} Diego Bazán</span>
                    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        {footerLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </footer>
        </div>
    )
}
