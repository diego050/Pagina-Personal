
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:8000';
const SITE_URL = 'https://diegovelazquez.dev';

// Static routes
const staticRoutes = [
    '/',
    '/sobre-mi',
    '/proyectos',
    '/blog',
    '/en',
    '/en/about',
    '/en/projects',
    '/en/blog'
];

async function generateSitemap() {
    console.log('Generating sitemap...');
    let urls = [...staticRoutes];

    try {
        // Fetch Projects
        console.log('Fetching projects...');
        const projectsRes = await axios.get(`${API_URL}/projects`);
        const projects = projectsRes.data;
        projects.forEach(p => {
            if (p.slug) {
                urls.push(`/project/${p.slug}`);
                urls.push(`/en/project/${p.slug}`);
            }
        });

        // Fetch Articles
        console.log('Fetching articles...');
        const articlesRes = await axios.get(`${API_URL}/articles`);
        const articles = articlesRes.data;
        articles.forEach(a => {
            if (a.is_published && a.slug) {
                // Ensure correct routing (assuming blog/ prefix for all articles)
                urls.push(`/blog/${a.slug}`);
                urls.push(`/en/blog/${a.slug}`);
            }
        });

    } catch (error) {
        console.error('Error fetching data for sitemap (API might be down):', error.message);
        console.log('Generating sitemap with static routes only.');
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${urls.map(url => {
        const fullUrl = `${SITE_URL}${url}`;
        // Determine alternate
        const isEn = url.startsWith('/en');
        const alternateUrl = isEn
            ? `${SITE_URL}${url.replace('/en', '') || '/'}`
            : `${SITE_URL}/en${url === '/' ? '' : url}`;

        return `
    <url>
        <loc>${fullUrl}</loc>
        <changefreq>weekly</changefreq>
        <priority>${url === '/' || url === '/en' ? '1.0' : '0.8'}</priority>
        <xhtml:link rel="alternate" hreflang="${isEn ? 'es' : 'en'}" href="${alternateUrl}"/>
        <xhtml:link rel="alternate" hreflang="${isEn ? 'en' : 'es'}" href="${fullUrl}"/>
    </url>
        `.trim();
    }).join('\n    ')}
</urlset>`;

    const publicDir = path.resolve(__dirname, '../public');
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log(`Sitemap generated at ${path.join(publicDir, 'sitemap.xml')} with ${urls.length} URLs.`);
}

generateSitemap();
