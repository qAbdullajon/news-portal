import React from 'react'
import Cart from './Cart'
import { CartType } from '@/types/type';

export default function NewsPage() {
    const newsArray: CartType[] = [
        {
            id: "1",
            image: "https://thumbs.dreamstime.com/b/falling-drop-rain-blue-earth-image-water-splash-crown-shape-water-splash-crown-shape-falling-drop-earth-140453719.jpg",
            title: "Yangi Teknologiyalar Dunyosida So'nggi Yangiliklar",
            description: "Sun'iy intellekt va ma'lumotlar tahlili sohasidagi so'nggi yutuqlar haqida to'liq ma'lumot.",
            created_at: "2024-01-15",
            category: "Texnologiya"
        },
        {
            id: "2",
            image: "https://good-nature-blog-uploads.s3.amazonaws.com/uploads/2023/01/FB03842E-FD05-456B-A652-FB2BCDEA372E.jpeg",
            title: "Sport Olamidagi Eng So'nggi Voqealar",
            description: "Jahon chempionati va xalqaro musobaqalardagi eng qiziqarli voqealar haqida maqola.",
            created_at: "2024-01-14",
            category: "Sport"
        },
        {
            id: "3",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3",
            title: "Iqtisodiyotdagi O'zgarishlar va Trendlar",
            description: "Global iqtisodiyotdagi so'nggi o'zgarishlar va kelajakdagi prognozlar haqida tahlil.",
            created_at: "2024-01-13",
            category: "Iqtisodiyot"
        },
        {
            id: "4",
            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3",
            title: "Tabiat va Atrof-muhit Muhofazasi",
            description: "Tabiatni muhofaza qilish va ekologik muammolar haqida dolzarb maqola.",
            created_at: "2024-01-12",
            category: "Tabiat"
        },
        {
            id: "5",
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3",
            title: "Madaniyat va San'at Songgi Yangiliklari",
            description: "Dunyo madaniyati va san'at sohasidagi yangiliklar va tadbirlar haqida ma'lumot.",
            created_at: "2024-01-11",
            category: "Madaniyat"
        },
        {
            id: "6",
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3",
            title: "Ovqatlanish va Sog'lom Turmush Tarzi",
            description: "Sog'lom ovqatlanish va turmush tarzi haqida foydali maslahatlar va yangiliklar.",
            created_at: "2024-01-10",
            category: "Sog'liq"
        },
        {
            id: "7",
            image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-4.0.3",
            title: "Ta'lim Sohasidagi Innovatsiyalar",
            description: "Zamonaviy ta'lim texnologiyalari va usullari haqida yangiliklar va tahlillar.",
            created_at: "2024-01-09",
            category: "Ta'lim"
        },
        {
            id: "8",
            image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3",
            title: "Sayyohlik va Sarguzashtlar Dunyosi",
            description: "Dunyoning eng chiroyli joylari va sayyohlik uchun qiziqarli manzillar haqida.",
            created_at: "2024-01-08",
            category: "Sayyohlik"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {newsArray.map((item, index) => (
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