import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { getAlternateUrl } from '../utils/routeMappings';
import { CONFIG, getAbsoluteUrl } from '../config';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    imageAlt?: string;
    imageWidth?: number | string;
    imageHeight?: number | string;
    imageType?: string;
    type?: string;
}

export default function SEO({ title, description, image, imageAlt, imageWidth, imageHeight, imageType = 'image/webp', type = 'website' }: SEOProps) {
    const { language } = useLanguage();
    const location = useLocation();

    const currentUrl = getAbsoluteUrl(location.pathname);
    const distinctPath = location.pathname;

    // Calculate alternate URLs
    const esPath = language === 'es' ? distinctPath : getAlternateUrl(distinctPath, 'en');
    const enPath = language === 'en' ? distinctPath : getAlternateUrl(distinctPath, 'es');

    const esUrl = getAbsoluteUrl(esPath);
    const enUrl = getAbsoluteUrl(enPath);

    const absoluteImage = image ? getAbsoluteUrl(image) : getAbsoluteUrl(CONFIG.DEFAULT_OG_IMAGE);

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
            "name": "Diego Velazquez"
        },
        ...(image && { "image": absoluteImage })
    };

    return (
        <Helmet>
            <title>{title} | Portafolio</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:image:secure_url" content={absoluteImage} />
            {imageType && <meta property="og:image:type" content={imageType} />}
            {imageWidth && <meta property="og:image:width" content={imageWidth.toString()} />}
            {imageHeight && <meta property="og:image:height" content={imageHeight.toString()} />}
            {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
            <meta property="og:locale" content={language === 'es' ? 'es_ES' : 'en_US'} />
            <meta property="og:site_name" content="Diego Velazquez Portfolio" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteImage} />
            {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}

            {/* Hreflang for SEO */}
            <link rel="canonical" href={currentUrl} />
            {/* @ts-ignore */}
            <link rel="alternate" hreflang="es" href={esUrl} />
            {/* @ts-ignore */}
            <link rel="alternate" hreflang="en" href={enUrl} />
            {/* @ts-ignore */}
            <link rel="alternate" hreflang="x-default" href={esUrl} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
}
