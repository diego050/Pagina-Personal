import React from 'react';
import { getBackendUrl } from '../config';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    className?: string;
    lazy?: boolean;
}

export default function ResponsiveImage({ src, alt, width, height, className = '', lazy = true, ...props }: ResponsiveImageProps) {
    // If the image is external or not local, we just render a standard img (we can't generate srcSets for external urls if we don't control them)
    // Assume local means relative path or starting with our backend url
    // Normalize src for local checks
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
                {...props} 
            />
        );
    }

    // Ensure local paths from DB (like 'projects/img.webp') are correctly prefixed if they don't have it
    let finalSrc = src;
    if (!finalSrc.startsWith('/static/uploads') && !finalSrc.startsWith('http') && !finalSrc.startsWith('/')) {
        finalSrc = `/static/uploads/${finalSrc}`;
    }

    const lastDotIndex = finalSrc.lastIndexOf('.');
    const basePath = lastDotIndex !== -1 ? finalSrc.substring(0, lastDotIndex) : finalSrc;
    const ext = lastDotIndex !== -1 ? finalSrc.substring(lastDotIndex).toLowerCase() : '';

    // If it's webp, we provide srcSet
    if (ext === '.webp') {
        const srcSet = `
            ${basePath}-sm.webp 400w,
            ${basePath}-md.webp 800w,
            ${basePath}-lg.webp 1200w,
            ${finalSrc} 1600w
        `;
        
        return (
            <picture>
                <source srcSet={srcSet} type="image/webp" />
                <img 
                    src={getBackendUrl(finalSrc)} 
                    alt={alt} 
                    loading={lazy ? "lazy" : "eager"} 
                    width={width} 
                    height={height} 
                    className={className}
                    {...props}
                />
            </picture>
        );
    }

    return (
        <img 
            src={getBackendUrl(src)} 
            alt={alt} 
            loading={lazy ? "lazy" : "eager"} 
            width={width} 
            height={height} 
            className={className} 
            {...props} 
        />
    );
}
