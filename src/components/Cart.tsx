"use client"

import { CartType } from '@/types/type';
import Link from 'next/link';
import React from 'react'
import NewsImage from './NewsImage';
import { useLanguage } from '@/contexts/LanguageContext';

const Cart = ({ cart }: { cart: CartType; priority?: boolean }) => {
    const { id, image, title, description, created_at, category } = cart;
    const { language } = useLanguage()

    return (
        <div className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white h-full flex flex-col">
            {/* Rasm qismi */}
            <div className="relative h-48 w-full overflow-hidden">
                <NewsImage
                    src={image}
                    alt={title}
                    fill
                    className="group-hover:scale-105 transition-transform duration-300"
                />
                {category && (
                    <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                        {category}
                    </div>
                )}
            </div>

            {/* Kontent qismi */}
            <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs text-gray-500 font-medium">
                    {new Date(created_at).toLocaleDateString()}
                </span>

                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {description}
                </p>

                <Link
                    href={`${language}/news/${id}`}
                    className="inline-flex items-center text-black font-medium text-sm group-hover:underline mt-auto"
                >
                    Ko'proq o'qish
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default Cart