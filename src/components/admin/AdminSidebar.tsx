import { useLanguage } from '@/contexts/LanguageContext'
import { FileText, LayoutDashboard, Plus } from 'lucide-react'
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

    return (
        <div className="w-64 bg-gray-50 text-black border-r border-gray-200">
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
            <nav className="py-4 px-2">
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
        </div>
    )
}

export default AdminSidebar