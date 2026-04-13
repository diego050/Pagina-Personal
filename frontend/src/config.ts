/**
 * Global Configuration Site-wide
 * Change these values when deploying to production.
 */

export const CONFIG = {
    // The domain where your site will be hosted (e.g., https://dbtech.com)
    // Used for SEO tags and canonical links
    SITE_URL: 'https://diegovelazquez.dev', 
    
    // The URL of your FastAPI backend
    // In development it's usually http://localhost:8000
    BACKEND_URL: 'http://localhost:8000',
    
    // Default SEO metadata if not provided
    DEFAULT_OG_IMAGE: '/static/uploads/profile.webp'
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
