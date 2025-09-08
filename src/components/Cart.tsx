'use client'

import { CartType } from '@/types/type';
import Link from 'next/link';
import React from 'react'
import NewsImage from './NewsImage';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

interface CartProps {
    cart: CartType;
    priority?: boolean;
}

const Cart = ({ cart, priority = false }: CartProps) => {
    const { language } = useLanguage();

    // Tilga qarab sarlavha va tavsifni olish
    const getLocalizedTitle = () => {
        switch (language) {
            case 'ru':
                return cart.titleRu || cart.titleUz || cart.titleEn || '';
            case 'en':
                return cart.titleEn || cart.titleUz || cart.titleRu || '';
            default:
                return cart.titleUz || cart.titleRu || cart.titleEn || '';
        }
    };

    const getLocalizedDescription = () => {
        switch (language) {
            case 'ru':
                return cart.descriptionRu || cart.descriptionUz || cart.descriptionEn || '';
            case 'en':
                return cart.descriptionEn || cart.descriptionUz || cart.descriptionRu || '';
            default:
                return cart.descriptionUz || cart.descriptionRu || cart.descriptionEn || '';
        }
    };

    const getLocalizedReadMore = () => {
        switch (language) {
            case 'ru':
                return "Читать далее";
            case 'en':
                return "Read more";
            default:
                return "Ko'proq o'qish";
        }
    };

    const title = getLocalizedTitle();
    const description = getLocalizedDescription();
    const readMoreText = getLocalizedReadMore();

    // Slug yoki ID ni ishlatish
    const newsIdentifier = cart.slug || cart.id;

    return (
        <div className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white h-full flex flex-col">
            {/* Rasm qismi */}
            <div className="relative h-48 w-full overflow-hidden">
                <NewsImage
                    src={cart.image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Kategoriya - agar mavjud bo'lsa */}
                {cart.category && (
                    <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                        {cart.category}
                    </div>
                )}
            </div>

            {/* Kontent qismi */}
            <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs text-gray-500 font-medium">
                    {cart.createdAt ? format(new Date(cart.createdAt), 'yyyy-MM-dd') : "Sana yo'qgit "}
                </span>

                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {description}
                </p>

                <Link
                    href={`/${language}/news/${newsIdentifier}`}
                    className="inline-flex items-center text-black font-medium text-sm group-hover:underline mt-auto"
                >
                    {readMoreText}
                    <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default Cart;