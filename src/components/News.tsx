'use client'

import React, { useEffect, useState } from 'react'
import Cart from './Cart'
import { CartType } from '@/types/type';

export default function NewsPage() {
    const [newsArray, setNewsArray] = useState<CartType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Backenddan yangiliklarni olish
    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/news');

                if (!response.ok) {
                    throw new Error('Yangiliklar yuklanmadi');
                }

                const data = await response.json();
                setNewsArray(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
                console.error('Yangiliklarni yuklashda xatolik:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Yangiliklar yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">Xatolik</h2>
                    <p className="mt-2 text-gray-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Qayta urinish
                    </button>
                </div>
            </div>
        );
    }

    if (newsArray.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Yangiliklar topilmadi</h2>
                    <p className="mt-2 text-gray-600">Hozircha hech qanday yangilik mavjud emas</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {newsArray.map((item) => (
                        <Cart
                            key={item.id}
                            cart={item}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}