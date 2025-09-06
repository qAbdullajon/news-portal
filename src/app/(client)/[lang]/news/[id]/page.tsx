// src/app/[lang]/news/[id]/page.tsx
'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import NewsImage from '@/components/NewsImage';
import Link from 'next/link';
import { use, useState } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

// Mock ma'lumotlar - keyin API dan olasiz
const mockNews = {
    id: "1",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3",
    title: "Yangi Teknologiyalar Dunyosida So'nggi Yangiliklar",
    titleRu: "Последние новости в мире новых технологий",
    titleEn: "Latest News in the World of New Technologies",
    description: "Sun'iy intellekt va ma'lumotlar tahlili sohasidagi so'nggi yutuqlar haqida to'liq ma'lumot.",
    descriptionRu: "Полная информация о последних достижениях в области искусственного интеллекта и анализа данных.",
    descriptionEn: "Complete information about the latest achievements in artificial intelligence and data analysis.",
    content: `
    <p>Sun'iy intellext (AI) sohasi so'nggi yillarda juda tez rivojlanmoqda. Dunyoning yetakchi texnologik kompaniyalari AI tadqiqotlariga milliardlab dollar sarmoya kiritmoqdalar.</p>
    
    <p>Machine learning algoritmlari endi faqatgina ilmiy tadqiqotlar darajasida emas, balki kundalik hayotimizning turli sohalarida qo'llanilmoqda. Bu esa dunyoni butunlay o'zgartiradi.</p>
    
    <h2>AI ning Kelajagi</h2>
    <p>Mutaxassislarning fikricha, sun'iy intellekt keyingi 10 yil ichida insoniyatning barcha sohalariga ta'sir ko'rsatadi. Sog'liqni saqlash, ta'lim, transport va boshqa ko'plab sohalarda AI texnologiyalari inqilob qilmoqda.</p>
  `,
    contentRu: `
    <p>Область искусственного интеллекта (ИИ) в последние годы очень быстро развивается. Ведущие технологические компании мира инвестируют миллиарды долларов в исследования ИИ.</p>
    
    <p>Алгоритмы машинного обучения теперь применяются не только на уровне научных исследований, но и в различных сферах нашей повседневной жизни. Это полностью меняет мир.</p>
  `,
    contentEn: `
    <p>The field of artificial intelligence (AI) has been developing very rapidly in recent years. The world's leading technology companies are investing billions of dollars in AI research.</p>
    
    <p>Machine learning algorithms are now being applied not only at the level of scientific research, but also in various areas of our daily lives. This is completely changing the world.</p>
  `,
    created_at: "2024-01-15T10:30:00Z",
    category: "Texnologiya",
    categoryRu: "Технология",
    categoryEn: "Technology",
    author: "Ali Ahmedov",
    tags: ["AI", "Texnologiya", "Innovatsiya"],
    link_url: 'https://youtube.com',
    imagesBlock: [
        "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3",
    ],
    link_title: "Youtube",
    relatedNews: [
        {
            id: "2",
            image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3",
            title: "Sport Olamidagi Eng So'nggi Voqealar",
            created_at: "2024-01-14",

        },
        {
            id: "3",
            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3",
            title: "Tabiat va Atrof-muhit Muhofazasi",
            created_at: "2024-01-13",
        }
    ]
};

export default function NewsDetailPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
    const { lang, id } = use(params);
    const { language } = useLanguage();

    // Tilga qarab ma'lumotlarni olish
    const getLocalizedData = () => {
        switch (language) {
            case 'ru':
                return {
                    title: mockNews.titleRu,
                    description: mockNews.descriptionRu,
                    content: mockNews.contentRu,
                    category: mockNews.categoryRu,
                    readMore: "Читать далее",
                    relatedNews: "Похожие новости",
                    backToNews: "Назад к новостям",
                    linkUrl: mockNews.link_url,
                    linkTitle: mockNews.link_title,
                    imagesBlock: mockNews.imagesBlock
                };
            case 'en':
                return {
                    title: mockNews.titleEn,
                    description: mockNews.descriptionEn,
                    content: mockNews.contentEn,
                    category: mockNews.categoryEn,
                    readMore: "Read more",
                    relatedNews: "Related news",
                    backToNews: "Back to news",
                    linkUrl: mockNews.link_url,
                    linkTitle: mockNews.link_title,
                    imagesBlock: mockNews.imagesBlock
                };
            default:
                return {
                    title: mockNews.title,
                    description: mockNews.description,
                    content: mockNews.content,
                    category: mockNews.category,
                    readMore: "Ko'proq o'qish",
                    relatedNews: "Tegishli yangiliklar",
                    backToNews: "Yangiliklarga qaytish",
                    linkUrl: mockNews.link_url,
                    linkTitle: mockNews.link_title,
                    imagesBlock: mockNews.imagesBlock
                };
        }
    };

    const localized = getLocalizedData();

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
                                src={mockNews.image}
                                alt={localized.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                                className="object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                                {localized.category}
                            </div>
                        </div>

                        {/* Sarlavha va meta ma'lumotlar bloki */}
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-500">
                                    {new Date(mockNews.created_at).toLocaleDateString(language)}
                                </span>
                                <span className="text-sm text-gray-500">{mockNews.author}</span>
                            </div>

                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                {localized.title}
                            </h1>

                            <p className="text-lg text-gray-600 mb-6">
                                {localized.description}
                            </p>

                            {/* Teglar */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {mockNews.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Matn bloki */}
                        <div className="px-6 pb-6">
                            <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: localized.content }}
                            />
                        </div>

                        {/* Images blocki */}
                        {localized.imagesBlock && localized.imagesBlock.length > 0 && (
                            <div className="px-6 pb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    {localized.imagesBlock.map((url, i) => (
                                        <div key={i} className="relative h-64 md:h-80 w-full">
                                            <NewsImage
                                                src={url}
                                                alt={`News image ${i + 1}`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-200 bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Batafsil ma'lumot olish uchun</h3>

                            <div className="space-y-4">
                                {/* Sarlavha havolasi */}
                                <Link
                                    href={localized.linkUrl}
                                    className="block text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors duration-200"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {localized.linkTitle}
                                </Link>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}