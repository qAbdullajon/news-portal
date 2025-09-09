'use client';

import Image from 'next/image';
import { useState } from 'react';

interface NewsImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    sizes?: string;
}

const NewsImage: React.FC<NewsImageProps> = ({
    src,
    alt,
    fill = false,
    className = '',
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Agar rasm yuklanmagan bo'lsa, muqova ko'rsatish
    if (hasError) {
        return (
            <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
                <span className="text-gray-500">Rasm yuklanmadi</span>
            </div>
        );
    }

    return (
        <>
            {fill ? (
                // Fill rejimida ham Image komponentidan foydalanish
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority={true}
                    className={`object-cover duration-700 ease-in-out group-hover:opacity-90 ${isLoading
                            ? 'scale-110 blur-2xl grayscale'
                            : 'scale-100 blur-0 grayscale-0'
                        } ${className}`}
                    sizes={sizes}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setHasError(true);
                    }}
                />
            ) : (
                <Image
                    src={src}
                    alt={alt}
                    width={400}
                    height={250}
                    priority={true}
                    className={`object-cover duration-700 ease-in-out group-hover:opacity-90 ${isLoading
                            ? 'scale-110 blur-2xl grayscale'
                            : 'scale-100 blur-0 grayscale-0'
                        } ${className}`}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setHasError(true);
                    }}
                />
            )}
        </>
    );
};

export default NewsImage;