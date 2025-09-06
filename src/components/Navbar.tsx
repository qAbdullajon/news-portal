"use client"

import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { useLanguage } from '@/contexts/LanguageContext';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/utils';

const Navbar = () => {
    const { language, setLanguage } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();

    const changeLanguage = (newLang: 'uz' | 'ru' | 'en') => {
        setLanguage(newLang);

        // URLni yangi tilga moslash
        const segments = pathname.split('/');
        if (segments.length > 1 && ['uz', 'ru', 'en'].includes(segments[1])) {
            segments[1] = newLang;
            router.push(segments.join('/'));
        } else {
            router.push(`/${newLang}${pathname}`);
        }
    };

    if (!language) return null

    return (
        <div className='flex items-center justify-between px-8 py-5 border-b border-gray-300'>
            {pathname.split('/').length === 2 ? (
                <Link href={'/'} className='text-3xl font-semibold capitalize'>{useTranslations(language)('title')}</Link>
            ) : (
                <Button onClick={() => router.back()} variant={'outline'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                    <p>Back to News</p>
                </Button>
            )}

            <div className='flex items-center gap-4'>
                <Button onClick={() => changeLanguage('uz')}
                    variant={language === "uz" ? 'default' : 'outline'}>O'zbek</Button>
                <Button onClick={() => changeLanguage('ru')}
                    variant={language === "ru" ? 'default' : 'outline'}>Русский</Button>
                <Button onClick={() => changeLanguage('en')}
                    variant={language === "en" ? 'default' : 'outline'}>English</Button>
                <Button onClick={() => router.push('/admin')} variant={'default'}>Admin</Button>
            </div>
        </div>
    )
}

export default Navbar