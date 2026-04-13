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
    let normalizedSrc = src;
    if (!normalizedSrc.startsWith('/static/uploads') && !normalizedSrc.startsWith('http') && !normalizedSrc.startsWith('/')) {
        normalizedSrc = `/static/uploads/${normalizedSrc}`;
    }

    // Determine if we should use the backend URL (only for uploads)
    const isBackendUpload = normalizedSrc.startsWith('/static/uploads');
    const resolveUrl = (path: string) => isBackendUpload ? getBackendUrl(path) : path;



    // Return standard img for all images to avoid 404s on non-existent responsive versions
    return (
        <img 
            src={resolveUrl(normalizedSrc)} 
            alt={alt} 
            loading={lazy ? "lazy" : "eager"} 
            width={width} 
            height={height} 
            className={className} 
            {...props} 
        />
    );

    return (
        <img 
            src={resolveUrl(normalizedSrc)} 
            alt={alt} 
            loading={lazy ? "lazy" : "eager"} 
            width={width} 
            height={height} 
            className={className} 
            {...props} 
        />
    );
}
