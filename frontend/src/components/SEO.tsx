import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { getAlternateUrl } from '../utils/routeMappings';
import { CONFIG, getAbsoluteUrl, getBackendUrl } from '../config';

/**
 * og:image must be an absolute URL that actually serves an image.
 *
 * Uploads are served by the backend, which nginx exposes under /api -- resolving them
 * against the site root instead returns the SPA's index.html, so the preview card ends
 * up with no image at all. Everything else (files in public/) lives at the site root.
 */
const toAbsoluteAsset = (path: string) =>
    path.startsWith('/static/uploads') ? getBackendUrl(path) : getAbsoluteUrl(path);

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    imageAlt?: string;
    imageWidth?: number | string;
    imageHeight?: number | string;
    imageType?: string;
    type?: string;
    /** Off for the home page, whose title already carries the full brand. */
    appendSiteName?: boolean;
}

/**
 * Per-page document metadata.
 *
 * Uses React 19's built-in hoisting: <title>, <meta> and <link> rendered anywhere in
 * the tree are moved into <head> automatically. This replaced react-helmet-async,
 * which only supports React <= 18 and silently rendered nothing under React 19.
 *
 * index.html carries a fallback copy of these tags for crawlers that do not run JS
 * (the social link-preview bots). Those are marked data-default and dropped here on
 * mount, otherwise Google would read the stale generic copy: for <meta> the first
 * matching tag in the document wins, and the static ones come first.
 */
function useClearDefaultMetaTags() {
    useEffect(() => {
        document.head.querySelectorAll('[data-default]').forEach(el => el.remove());
    }, []);
}

export default function SEO({ title, description, image, imageAlt, imageWidth, imageHeight, imageType = 'image/webp', type = 'website', appendSiteName = true }: SEOProps) {
    const { language } = useLanguage();
    const location = useLocation();

    useClearDefaultMetaTags();

    const currentUrl = getAbsoluteUrl(location.pathname);
    const distinctPath = location.pathname;

    // Calculate alternate URLs
    const esPath = language === 'es' ? distinctPath : getAlternateUrl(distinctPath, 'en');
    const enPath = language === 'en' ? distinctPath : getAlternateUrl(distinctPath, 'es');

    const esUrl = getAbsoluteUrl(esPath);
    const enUrl = getAbsoluteUrl(enPath);

    const absoluteImage = toAbsoluteAsset(image || CONFIG.DEFAULT_OG_IMAGE);

    const fullTitle = appendSiteName ? `${title} — DBtech` : title;

    // Structured Data (JSON-LD)
    const structuredData = {
        "@context": "https://schema.org",
        "@type": type === 'article' ? "Article" : "WebSite",
        "name": title,
        "description": description,
        "url": currentUrl,
        "inLanguage": language === 'es' ? "es" : "en",
        "author": {
            "@type": "Person",
            "name": "Diego Bazán"
        },
        ...(image && { "image": absoluteImage })
    };

    return (
        <>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:image:secure_url" content={absoluteImage} />
            {imageType && <meta property="og:image:type" content={imageType} />}
            {imageWidth && <meta property="og:image:width" content={imageWidth.toString()} />}
            {imageHeight && <meta property="og:image:height" content={imageHeight.toString()} />}
            {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
            <meta property="og:locale" content={language === 'es' ? 'es_ES' : 'en_US'} />
            <meta property="og:site_name" content="DBtech" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteImage} />
            {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}

            {/* Hreflang for SEO */}
            <link rel="canonical" href={currentUrl} />
            <link rel="alternate" hrefLang="es" href={esUrl} />
            <link rel="alternate" hrefLang="en" href={enUrl} />
            <link rel="alternate" hrefLang="x-default" href={esUrl} />

            {/* JSON-LD. React 19 only hoists <script> when it is async with a src, so this
                stays where it is rendered -- which Google explicitly supports. */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </>
    );
}
