import { useLanguage } from '@/contexts/LanguageContext'
import { FileText, LayoutDashboard, Plus, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const AdminSidebar = () => {
    const pathname = usePathname()
    const router = useRouter()
    const { setAdminHeaderTitle } = useLanguage()

    const navigation = [
        {
            id: 2,
            href: "/admin",
            title: "Yangiliklar ro'yxati",
            icon: FileText,
            headerTitle: "Barcha yangiliklar"
        },
        {
            id: 3,
            href: "/admin/create",
            title: "Yangilik yaratish",
            icon: Plus,
            headerTitle: "Yangilik yaratish"
        },
    ]

    const handleLogout = async () => {
        try {
            // Logout API ga so'rov yuborish
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const data = await response.json()

            if (response.ok && data.success) {
                // Login sahifasiga yo'naltirish
                router.push('/admin/login')
                // Sahifani yangilash
                setTimeout(() => {
                    router.refresh()
                }, 100)
            } else {
                console.error('Logout failed:', data.error)
                // Agar API ishlamasa, manual ravishda cookie ni tozalash
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                router.push('/admin/login')
                router.refresh()
            }
        } catch (error) {
            console.error('Logout error:', error)
            // Xatolik bo'lsa ham cookie ni tozalab login sahifasiga o'tish
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
            router.push('/admin/login')
            router.refresh()
        }
    }



    return (
        <div className="w-64 bg-gray-50 text-black border-r border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Admin Panel</h2>
            </div>
            <div className="p-3 border-b flex items-center gap-3 border-gray-200">
                <div className='uppercase text-white bg-black w-8 h-8 rounded-full flex items-center justify-center'>A</div>
                <div>
                    <p className='leading-5'>admin</p>
                    <p className='text-sm font-light text-gray-400'>Administrator</p>
                </div>
            </div>
            <nav className="py-4 px-2 flex-1">
                <ul className="space-y-1">
                    {
                        navigation.map((item) => (
                            <li key={item.id}>
                                <Link
                                    onClick={() => setAdminHeaderTitle(item.headerTitle)}
                                    href={item.href}
                                    className={`flex items-center gap-3 font-sans px-4 py-2 rounded-md ${pathname === item.href ? 'text-white bg-black' : 'hover:bg-black hover:text-white'}`}
                                >
                                    <item.icon className='w-4' />
                                    {item.title}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </nav>

            {/* Logout tugmasi */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                    <LogOut className='w-4' />
                    Chiqish
                </button>
            </div>
        </div>
    )
}

export default AdminSidebar