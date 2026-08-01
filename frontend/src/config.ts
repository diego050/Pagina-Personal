/**
 * Global Configuration Site-wide
 * Change these values when deploying to production.
 */

export const CONFIG = {
    // The domain where your site will be hosted (e.g., https://dbtech.com)
    // Used for SEO tags and canonical links
    SITE_URL: import.meta.env.VITE_SITE_URL || 'https://dbtech.cloud', 
    
    // The URL of your FastAPI backend
    // In development it's usually http://localhost:8000
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
    
    // Social preview card used when a page supplies no image of its own.
    // Served from frontend/public, so it matches the fallback in index.html and shows
    // the same card whether or not the crawler runs JavaScript.
    DEFAULT_OG_IMAGE: '/og-image.webp'
};

/**
 * Utility to get an absolute URL for an asset or page.
 * It prepends the SITE_URL to a relative path.
 */
export const getAbsoluteUrl = (path: string): string => {
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${CONFIG.SITE_URL}${cleanPath}`;
};

/**
 * Utility to get an absolute URL for a backend asset.
 * It prepends the BACKEND_URL to a relative path.
 * Usually used for images in /static/uploads/
 */
export const getBackendUrl = (path: string): string => {
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${CONFIG.BACKEND_URL}${cleanPath}`;
};
