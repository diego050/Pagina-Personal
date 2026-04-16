import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getAlternateUrl, STATIC_ROUTES } from '../utils/routeMappings';
import ResponsiveImage from './ResponsiveImage';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { language, setLanguage, t } = useLanguage();

    // ... (useEffect hook for scroll/resize remains same)
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // ... (useEffect for body overflow remains same)
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Dynamic Navigation Links
    const navLinks = [
        { name: t('home'), path: STATIC_ROUTES.home[language] },
        { name: t('about'), path: STATIC_ROUTES.about[language] },
        { name: t('projects'), path: STATIC_ROUTES.projects[language] },
        { name: t('blog'), path: STATIC_ROUTES.blog[language] },
    ];

    // Calculate alternate URL for Language Switcher
    const alternateLang = language === 'es' ? 'en' : 'es';
    const alternateUrl = getAlternateUrl(location.pathname, language);

    const handleLanguageSwitch = (e: React.MouseEvent) => {
        e.preventDefault();
        setLanguage(alternateLang);
        setIsOpen(false);
    };

    return (
        <>
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <Link to={STATIC_ROUTES.home[language]} className="flex items-center gap-3 text-primary font-bold text-xl tracking-tighter">
                                <ResponsiveImage src="/Logo.webp" alt="DBtech Logo" lazy={false} fetchPriority="high" className="w-10 h-10 object-contain" />
                                <span>DBtech</span>
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-center space-x-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-center flex items-center justify-center h-full ${location.pathname === link.path
                                            ? 'text-white bg-white/10'
                                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <a
                                    href={alternateUrl}
                                    onClick={handleLanguageSwitch}
                                    className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors ml-4 cursor-pointer"
                                >
                                    <Globe className="w-4 h-4" />
                                    <span>{language.toUpperCase()}</span>
                                </a>
                            </div>
                        </div>
                        <div className="md:hidden flex items-center gap-4">
                            <a
                                href={alternateUrl}
                                onClick={handleLanguageSwitch}
                                className="text-zinc-400 hover:text-white p-2 cursor-pointer"
                                aria-label={t('changeLanguage')}
                            >
                                <span className="font-bold">{language.toUpperCase()}</span>
                            </a>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-zinc-400 hover:text-white p-2"
                                title="Menu"
                                aria-label={isOpen ? (t('closeMenu') || 'Cerrar menú') : (t('openMenu') || 'Abrir menú')}
                            >
                                {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                            />
                            {/* Sidebar */}
                            <motion.div
                                key="sidebar"
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-white/10 z-[70] md:hidden shadow-2xl flex flex-col"
                            >
                                <div className="flex items-center justify-between p-4 border-b border-white/5">
                                    <span className="text-white font-bold text-lg">Menu</span>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                        aria-label={t('closeMenu') || 'Cerrar menú'}
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${location.pathname === link.path
                                                ? 'text-white bg-white/10 border-l-2 border-primary'
                                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                    <div className="mt-6 px-4 pt-6 border-t border-white/5">
                                        <a
                                            href={alternateUrl}
                                            onClick={handleLanguageSwitch}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors border border-white/10 cursor-pointer"
                                            aria-label={t('changeLanguage')}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-5 h-5" />
                                                <span>Idioma / Language</span>
                                            </div>
                                            <span className="font-bold text-white bg-primary/20 px-2 py-0.5 rounded text-sm">{language.toUpperCase()}</span>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
