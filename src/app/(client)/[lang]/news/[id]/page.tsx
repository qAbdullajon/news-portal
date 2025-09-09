'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import NewsImage from '@/components/NewsImage';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useParams } from 'next/navigation';

// Yangilik ma'lumotlari interfeysi
interface NewsContentBlock {
    id: string;
    type: string;
    contentUz: string;
    contentRu: string;
    contentEn: string;
    images: string[];
    linkTitle: string | null;
    linkUrl: string;
    order: number;
    newsId: string;
}

interface NewsData {
    id: string;
    slug: string;
    titleUz: string;
    titleRu: string;
    titleEn: string;
    descriptionUz: string;
    descriptionRu: string;
    descriptionEn: string;
    content: NewsContentBlock[];
    image: string;
    published: boolean;
    sendUrl: string;
    createdAt: string;
    updatedAt: string;
}

export default function NewsDetailPage() {
    const { language } = useLanguage();
    const [newsData, setNewsData] = useState<NewsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const lang = params.lang as string;
    const id = params.id as string;

    // Backenddan yangilik ma'lumotlarini olish
    useEffect(() => {
        const fetchNewsData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/news/${id}`);

                if (!response.ok) {
                    throw new Error('Yangilik ma\'lumotlarini yuklab bo‘lmadi');
                }

                const data = await response.json();
                console.log(data);

                setNewsData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
                console.error('Ma\'lumotlarni yuklashda xatolik:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNewsData();
        }
    }, [id]);

    // Tilga qarab ma'lumotlarni olish
    const getLocalizedData = () => {
        if (!newsData) return null;

        switch (language) {
            case 'ru':
                return {
                    title: newsData.titleRu,
                    description: newsData.descriptionRu,
                    category: "Новости",
                    readMore: "Читать далее",
                    relatedNews: "Похожие новости",
                    backToNews: "Назад к новостям",
                };
            case 'en':
                return {
                    title: newsData.titleEn,
                    description: newsData.descriptionEn,
                    category: "News",
                    readMore: "Read more",
                    relatedNews: "Related news",
                    backToNews: "Back to news",
                };
            default:
                return {
                    title: newsData.titleUz,
                    description: newsData.descriptionUz,
                    category: "Yangiliklar",
                    readMore: "Ko'proq o'qish",
                    relatedNews: "Tegishli yangiliklar",
                    backToNews: "Yangiliklarga qaytish",
                };
        }
    };

    // Kontent bloklarini tilga qarab olish
    const getLocalizedContent = (block: NewsContentBlock) => {
        switch (language) {
            case 'ru':
                return {
                    content: block.contentRu,
                    linkTitle: block.linkTitle || "Ссылка"
                };
            case 'en':
                return {
                    content: block.contentEn,
                    linkTitle: block.linkTitle || "Link"
                };
            default:
                return {
                    content: block.contentUz,
                    linkTitle: block.linkTitle || "Havola"
                };
        }
    };

    // Kontent bloklarini tartib bo'yicha saralash
    const sortedContentBlocks = newsData?.content
        ? [...newsData.content].sort((a, b) => a.order - b.order)
        : [];

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !newsData) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600">Xatolik</h2>
                        <p className="mt-2 text-gray-600">{error || "Yangilik topilmadi"}</p>
                        <Link
                            href={`/${lang}`}
                            className="mt-4 inline-block bg-black text-white px-4 py-2 rounded-md hover:bg-black/90 transition-colors"
                        >
                            Yangiliklar ro'yxatiga qaytish
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const localized = getLocalizedData();
    if (!localized) return null;

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-4xl">

                    {/* Asosiy yangilik ma'lumotlari */}
                    <article className="bg-white rounded-xl shadow-md overflow-hidden">
                        {/* Rasm bloki */}
                        <div className="relative h-64 md:h-96 w-full">
                            <NewsImage
                                src={newsData.image}
                                alt={localized.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {localized.category}
                            </div>
                        </div>

                        {/* Sarlavha va meta ma'lumotlar bloki */}
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-500">
                                    {new Date(newsData.createdAt).toLocaleDateString(language, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {new Date(newsData.updatedAt).toLocaleDateString(language, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                {localized.title}
                            </h1>

                            <p className="text-lg text-gray-600 mb-6">
                                {localized.description}
                            </p>
                        </div>

                        {/* Kontent bloklari */}
                        <div className="px-6 pb-6 space-y-6">
                            {sortedContentBlocks.map((block) => {
                                const localizedBlock = getLocalizedContent(block);

                                if (block.type === 'TEXT' && localizedBlock.content) {
                                    return (
                                        <div
                                            key={block.id}
                                            className="prose prose-lg max-w-none"
                                            dangerouslySetInnerHTML={{ __html: localizedBlock.content }}
                                        />
                                    );
                                }

                                if (block.type === 'IMAGE' && block.images.length > 0) {
                                    return (
                                        <div key={block.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {block.images.map((imageUrl, index) => (
                                                <div key={index} className="relative h-64 md:h-80 w-full">
                                                    <NewsImage
                                                        src={imageUrl}
                                                        alt={`${localized.title} - ${index + 1}`}
                                                        fill
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }

                                if (block.type === 'LINK' && block.linkUrl) {
                                    return (
                                        <div key={block.id} className="mt-8 pt-6 border-t border-gray-200 bg-gray-50 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                                {localized.readMore}
                                            </h3>
                                            <Link
                                                href={block.linkUrl}
                                                className="block text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors duration-200"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {localizedBlock.linkTitle}
                                            </Link>
                                        </div>
                                    );
                                }

                                return null;
                            })}
                        </div>

                        {/* Orqaga qaytish tugmasi */}
                        <div className="px-6 pb-6">
                            <Link
                                href={`/${lang}`}
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                {localized.backToNews}
                            </Link>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}