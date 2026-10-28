import { Component, Suspense } from 'react';
import type { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SocialLinks from '../components/SocialLinks';

interface ErrorBoundaryProps {
    resetKey: string;
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class RouteErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps) {
        if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
            this.setState({ hasError: false });
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
                    <p className="text-zinc-400">Hubo un problema al cargar esta sección.</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg transition-colors"
                    >
                        Recargar página
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function Layout() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col bg-background text-zinc-100 selection:bg-primary/30 selection:text-white overflow-x-hidden">
            <Navbar />
            <main className="flex-grow pt-16">
                <RouteErrorBoundary resetKey={location.pathname}>
                    <Suspense
                        fallback={
                            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                                <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                            </div>
                        }
                    >
                        <Outlet />
                    </Suspense>
                </RouteErrorBoundary>
            </main>
            <footer className="bg-surface border-t border-white/5 py-8 mt-20">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-zinc-500 text-sm">
                    <span>© {new Date().getFullYear()} Diego Bazán</span>
                    <SocialLinks />
                </div>
            </footer>
        </div>
    );
}
