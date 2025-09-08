// src/app/admin/layout.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'
import { NewsFormProvider } from '@/contexts/NewsFormContext'
import { Toaster } from '@/components/ui/sonner'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const { adminHeaderTitle } = useLanguage()
    const [isAuthenticated, setIsAuthenticated] = useState(true)

    useEffect(() => {
        // Auth tekshirish
        const auth = localStorage.getItem('adminAuth') || true
        if (!auth && pathname !== '/admin/login') {
            router.push('/admin/login')
        } else {
            setIsAuthenticated(true)
        }
    }, [router, pathname])

    // Login sahifasi alohida layoutga ega
    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    if (!isAuthenticated) {
        return <div className="flex justify-center items-center h-64">Yuklanmoqda...</div>
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-300">
                    <h1 className="text-2xl font-semibold text-gray-900 capitalize">{adminHeaderTitle}</h1>

                    {
                        pathname === "/admin/news" ? (
                            <Button onClick={() => router.push('/admin/create')}>
                                <Plus />
                                <p>Yangilik yaratish</p>
                            </Button>
                        ) : (
                            <Button onClick={() => router.push('/admin')} variant={'outline'}>
                                <ArrowLeft />
                                <p>Adminpanelga qaytish</p>
                            </Button>
                        )
                    }
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <NewsFormProvider>
                        <Toaster />
                        {children}
                    </NewsFormProvider>
                </main>
            </div>
        </div>
    )
}