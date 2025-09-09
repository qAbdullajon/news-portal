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
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/auth/is-auth')
                const data = await response.json()

                if (data.isAuthenticated) {
                    setIsAuthenticated(true)
                } else {
                    router.push('/admin/login')
                }
            } catch (error) {
                console.error('Auth check failed:', error)
                router.push('/admin/login')
            } finally {
                setLoading(false)
            }
        }

        if (pathname !== '/admin/login') {
            checkAuth()
        } else {
            setLoading(false)
        }
    }, [router, pathname])

    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <span className="ml-3 text-lg">Yuklanmoqda...</span>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-300">
                    <h1 className="text-2xl font-semibold text-gray-900 capitalize">{adminHeaderTitle}</h1>
                    {
                        pathname === "/admin/news" ? (
                            <Button onClick={() => router.push('/admin/news/create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Yangilik yaratish
                            </Button>
                        ) : pathname.startsWith("/admin/news/") ? (
                            <Button onClick={() => router.push('/admin/news')} variant={'outline'}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Yangiliklarga qaytish
                            </Button>
                        ) : (
                            <Button onClick={() => router.push('/admin')} variant={'outline'}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Asosiy menyu
                            </Button>
                        )
                    }
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <NewsFormProvider>
                        {/* Toaster komponentini provider ichiga qo'yish */}
                        <Toaster />
                        {children}
                    </NewsFormProvider>
                </main>
            </div>
        </div>
    )
}