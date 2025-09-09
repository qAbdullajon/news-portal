'use client';
import { useState } from 'react';

interface NewsImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
}

const NewsImage: React.FC<NewsImageProps> = ({
    src,
    alt,
    fill = false,
    className = ''
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <div className={`bg-gray-200 flex items-center justify-center rounded-lg ${className}`}>
                <span className="text-gray-500 text-sm">Rasm yuklanmadi</span>
            </div>
        );
    }

    return (
        <div className={`relative ${fill ? 'w-full h-full' : ''} ${className}`}>
            <img
                src={src}
                alt={alt}
                className={`object-cover w-full h-full duration-700 ease-in-out group-hover:opacity-90 rounded-lg ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
                    }`}
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