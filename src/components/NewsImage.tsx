'use client';

import Image from 'next/image';
import { useState } from 'react';

interface NewsImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    sizes?: string;
    priority?: boolean;
}

const NewsImage: React.FC<NewsImageProps> = ({
    src,
    alt,
    fill = false,
    className = '',
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    priority = false
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [imageSrc, setImageSrc] = useState(src);

    // Agar rasm yuklanmagan bo'lsa, muqova ko'rsatish
    if (hasError) {
        return (
            <div className={`bg-gray-200 flex items-center justify-center rounded-lg ${className}`}>
                <span className="text-gray-500 text-sm">Rasm yuklanmadi</span>
            </div>
        );
    }

    return (
        <div className={`relative ${fill ? 'w-full h-full' : ''} ${className}`}>
            <Image
                src={imageSrc}
                alt={alt}
                fill={fill}
                width={fill ? undefined : 400}
                height={fill ? undefined : 250}
                priority={priority}
                className={`object-cover duration-700 ease-in-out group-hover:opacity-90 rounded-lg ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
                    }`}
                sizes={sizes}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
            />
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default NewsImage;