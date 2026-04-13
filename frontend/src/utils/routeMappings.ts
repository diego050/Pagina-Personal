
export const STATIC_ROUTES = {
    home: { es: '/', en: '/en' },
    about: { es: '/sobre-mi', en: '/en/about' },
    projects: { es: '/proyectos', en: '/en/projects' },
    blog: { es: '/blog', en: '/en/blog' },
    login: { es: '/login', en: '/en/login' },
    admin: { es: '/admin', en: '/en/admin' },
};

// Returns the alternate language URL for the current path
export const getAlternateUrl = (currentPath: string, currentLang: 'es' | 'en'): string => {
    // 1. Check static routes
    for (const key in STATIC_ROUTES) {
        const route = STATIC_ROUTES[key as keyof typeof STATIC_ROUTES];
        if (route[currentLang] === currentPath) {
            const targetLang = currentLang === 'es' ? 'en' : 'es';
            return route[targetLang];
        }
    }

    // 2. Hierarchy/Dynamic/Fallback handling
    // If no static match, try to handle prefixes
    // ES to EN
    if (currentLang === 'es') {
        // e.g. /project/foo -> /en/project/foo
        // If we want to localize "project" to "proyectos", we need more logic.
        // For now, let's assume /project and /blog segments are shared or handled simply.
        // User requested "Best SEO", so /proyecto vs /project would be ideal, but requires App.tsx changes.
        // Let's implement /en prefixing for now for dynamic routes unless mapped.

        // Handle /project/ -> /en/project/
        if (currentPath.startsWith('/project/')) {
            return '/en' + currentPath;
        }
        // Handle /blog/ -> /en/blog/
        if (currentPath.startsWith('/blog/')) {
            return '/en' + currentPath;
        }

        if (currentPath === '/') return '/en';
        return '/en' + currentPath;
    }
    // EN to ES
    else {
        // /en/about -> /sobre-mi (handled by static)
        // /en/project/foo -> /project/foo
        if (currentPath.startsWith('/en/')) {
            const stripped = currentPath.substring(3); // remove /en
            if (stripped === '' || stripped === '/') return '/';
            return stripped;
        }
        return '/';
    }
};
