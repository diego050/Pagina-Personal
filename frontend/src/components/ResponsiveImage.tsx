import React from 'react';
import { getBackendUrl } from '../config';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    className?: string;
    lazy?: boolean;
    sizes?: string;
}

export default function ResponsiveImage({ 
    src, 
    alt, 
    width, 
    height, 
    className = '', 
    lazy = true, 
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw", 
    ...props 
}: ResponsiveImageProps) {
    // If the image is external or not local, we just render a standard img
    const isLocal = src.startsWith('/static/uploads') || 
                    src.startsWith('static/uploads') ||
                    src.startsWith('/') && !src.startsWith('//') || 
                    src.includes('localhost:8000/static/uploads');
    
    if (!isLocal || src.includes('://') && !src.includes('localhost:8000')) {
        return (
            <img 
                src={src} 
                alt={alt} 
                loading={lazy ? "lazy" : "eager"} 
                width={width} 
                height={height} 
                className={className} 
                sizes={sizes}
                {...props} 
            />
        );
    }

    // Ensure local paths from DB (like 'projects/img.webp') are correctly prefixed if they don't have it
    let normalizedSrc = src;
    if (!normalizedSrc.startsWith('/static/uploads') && !normalizedSrc.startsWith('http') && !normalizedSrc.startsWith('/')) {
        normalizedSrc = `/static/uploads/${normalizedSrc}`;
    }

    // Determine if we should use the backend URL (only for uploads)
    const isBackendUpload = normalizedSrc.startsWith('/static/uploads');
    const resolveUrl = (path: string) => isBackendUpload ? getBackendUrl(path) : path;

    const lastDotIndex = normalizedSrc.lastIndexOf('.');
    const basePath = lastDotIndex !== -1 ? normalizedSrc.substring(0, lastDotIndex) : normalizedSrc;
    const ext = lastDotIndex !== -1 ? normalizedSrc.substring(lastDotIndex).toLowerCase() : '';

    // If it's webp, we provide srcSet now that we ensured variants exist
    if (ext === '.webp') {
        const srcSet = `
            ${resolveUrl(`${basePath}-sm.webp`)} 400w,
            ${resolveUrl(`${basePath}-md.webp`)} 800w,
            ${resolveUrl(`${basePath}-lg.webp`)} 1200w,
            ${resolveUrl(normalizedSrc)} 1600w
        `;
        
        return (
            <picture className={`${className} block overflow-hidden`}>
                <source srcSet={srcSet} sizes={sizes} type="image/webp" />
                <img 
                    src={resolveUrl(normalizedSrc)} 
                    alt={alt} 
                    loading={lazy ? "lazy" : "eager"} 
                    width={width} 
                    height={height} 
                    className="w-full h-auto block" 
                    sizes={sizes}
                    {...props} 
                />
            </picture>
        );
    }

    return (
        <img 
            src={resolveUrl(normalizedSrc)} 
            alt={alt} 
            loading={lazy ? "lazy" : "eager"} 
            width={width} 
            height={height} 
            className={className} 
            sizes={sizes}
            {...props} 
        />
    );
}
