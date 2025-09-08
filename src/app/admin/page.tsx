"use client"

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NewsFormData, useNewsForm } from '@/contexts/NewsFormContext'
import { CartType } from '@/types/type'
import { format } from 'date-fns'
import { Eye, Search, SquarePen, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const NewsPageAdmin = () => {
    const router = useRouter()
    const { setFormData } = useNewsForm()
    const [allNews, setAllNews] = useState<CartType[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getAllNews = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/admin/news`, {
                    method: "GET"
                });

                if (response.ok) {
                    const result = await response.json();
                    setAllNews(result)

                    // toast.success("Yangilik muvaffaqiyatli saqlandi");
                } else {
                    const errorData = await response.json();
                    console.error("Server error:", errorData);
                    toast.error("Yangilikni saqlashda xatolik");
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false)
            }
        }
        getAllNews()
    }, [])

    const handleDelete = async (id: string) => {
        const isConfirm = confirm('Siz rostdan ham o‘chirmoqchimisiz?')
        if (isConfirm) {
            try {
                const response = await fetch(`/api/admin/news/${id}`, {
                    method: "DELETE"
                });
                if (response.ok) {
                    const result = await response.json();
                    setAllNews((prev) => prev.filter((item) => item.id !== id))
                } else {
                    const errorData = await response.json();
                    console.error("Server error:", errorData);
                    toast.error("Yangilikni saqlashda xatolik");
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleEdit = (item: any) => {
        setFormData(item)
        router.push(`/admin/edit/${item.id}`)
    }

    const handleView = (id: string) => {
        router.push(`/news/${id}`)
    }

    if (loading) {
        return null;
    }

    return (
        <div className='border border-gray-300 p-5 rounded-xl'>
            <div className='flex items-center justify-between'>
                <div className='relative w-1/3'>
                    <Input className='pl-10 bg-gray-100' placeholder='Search...' />
                    <div className='absolute top-2 left-3'>
                        <Search size={18} className='text-gray-500' />
                    </div>
                </div>
                <div>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="un-published">Un-published</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className='flex flex-col gap-5 mt-6'>
                {allNews.map((item) => (
                    <div className='flex items-center justify-between border border-gray-300 bg-gray-100 py-4 px-5 rounded-xl' key={item.id}>
                        <div>
                            <div className='flex items-center gap-5'>
                                <p className='text-sm font-semibold capitalize'>{item.titleEn}</p>
                                <p className='text-xs bg-gray-200 py-1 px-3 font-semibold rounded-xl'>{item.published ? 'Published' : 'Nashr qilinmagan'}</p>
                            </div>
                            <p className='text-base text-gray-500 pt-2 line-clamp-2'>{item.descriptionEn}</p>
                            <p className='text-xs text-gray-500 pt-2'>{item.createdAt ? format(new Date(item.createdAt), "yyyy-MM-dd") : "Noma'lum sana"}</p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <button onClick={() => handleView(item.id)} className='w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-xl'>
                                <Eye size={18} />
                            </button>
                            <button onClick={() => handleEdit(item)} className='w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-xl'>
                                <SquarePen size={18} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className='w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-xl'>
                                <Trash2 color='red' size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NewsPageAdmin