'use client';

import React, { useEffect, useState } from 'react';
import { z } from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useNewsForm } from '@/contexts/NewsFormContext';
import { toast } from 'sonner';

const formSchema = z.object({
    slug: z.string().min(4),
    sendUrl: z.string().optional(),
    image: z.instanceof(FileList).optional(),
    titleUz: z.string().min(1, "Sarlavha bo'sh bo'lmasligi kerak"),
    titleRu: z.string().min(1, "Sarlavha bo'sh bo'lmasligi kerak"),
    titleEn: z.string().min(1, "Sarlavha bo'sh bo'lmasligi kerak"),
    descriptionUz: z.string().min(1, "Tavsif bo'sh bo'lmasligi kerak"),
    descriptionRu: z.string().min(1, "Tavsif bo'sh bo'lmasligi kerak"),
    descriptionEn: z.string().min(1, "Tavsif bo'sh bo'lmasligi kerak"),
});

const CreateNews = () => {
    const router = useRouter();
    const { formData, setFormData, resetForm } = useNewsForm();
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: React.useMemo(() => ({
            slug: formData.slug || '',
            sendUrl: formData.sendUrl || '',
            titleUz: formData.title?.uz || '',
            titleRu: formData.title?.ru || '',
            titleEn: formData.title?.en || '',
            descriptionUz: formData.description?.uz || '',
            descriptionRu: formData.description?.ru || '',
            descriptionEn: formData.description?.en || '',
        }), [formData])
    });

    // Form qiymatlari o'zgarganda contextni yangilash - Tuzatilgan
    useEffect(() => {
        const subscription = form.watch((value) => {
            // Yangi obyekt yaratish
            const updatedData = {
                slug: value.slug || '',
                sendUrl: value.sendUrl || '',
                title: {
                    uz: value.titleUz || '',
                    ru: value.titleRu || '',
                    en: value.titleEn || '',
                },
                description: {
                    uz: value.descriptionUz || '',
                    ru: value.descriptionRu || '',
                    en: value.descriptionEn || '',
                },
            };

            setFormData(prev => ({
                ...prev,
                ...updatedData
            }));
        });

        return () => subscription.unsubscribe();
    }, [setFormData]); // Faqat setFormData

    // Rasmni o'qib, preview yaratish
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: file,
                    imagePreview: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Submit handler
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true)
            const formDataToSend = new FormData();

            // Text ma'lumotlarni qo'shish
            formDataToSend.append('slug', formData.slug);
            formDataToSend.append('sendUrl', formData.sendUrl || '');
            formDataToSend.append('titleUz', formData.title.uz);
            formDataToSend.append('titleRu', formData.title.ru);
            formDataToSend.append('titleEn', formData.title.en);
            formDataToSend.append('descriptionUz', formData.description.uz);
            formDataToSend.append('descriptionRu', formData.description.ru);
            formDataToSend.append('descriptionEn', formData.description.en);
            formDataToSend.append('published', formData.published.toString());
            formDataToSend.append('content', JSON.stringify(formData.content));

            // Rasmni qo'shish
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const response = await fetch('/api/admin/news', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                const result = await response.json();
                resetForm();
                router.push(`/admin/edit/${result.id}`);
                toast.success('Yangilik muvaffaqiyatli yaratildi');
            } else {
                const errorData = await response.json();
                console.error('Server error:', errorData);
                toast.error('Yangilik yaratishda xatolik');
            }
        } catch (error) {
            console.error('Network error:', error);
            toast.error('Tarmoq xatosi');
        }
        finally {
            setLoading(false)
        }
    }


    const handleCancel = () => {
        resetForm();
        router.back();
    };
    return (
        <div className='max-w-4xl mx-auto'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className='p-5 border border-gray-300 rounded-xl space-y-6'>
                        <p className='font-semibold text-xl pb-2'>Asosiy malumotlar</p>
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="yanglik-slug" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        URL manzili uchun ishlatilinadi (masalan: yangilik-slug)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sendUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Yo'naltirish URL (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Agar to'ldirilsa, yangilik bu manzilga yo'naltiriladi
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem>
                                    <FormLabel>Bosh rasm *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='file'
                                            accept="image/*"
                                            {...fieldProps}
                                            onChange={(e) => {
                                                onChange(e.target.files);
                                                handleImageChange(e);
                                            }}
                                        />
                                    </FormControl>
                                    {formData.imagePreview && (
                                        <div className="mt-2">
                                            <img
                                                src={formData.imagePreview}
                                                alt="Rasm preview"
                                                className="w-32 h-32 object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                    <FormDescription>
                                        Yangilik uchun asosiy rasm tanlang (JPG, PNG, WebP)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='p-5 border border-gray-300 rounded-xl space-y-6'>
                        <p className='font-semibold text-xl pb-2'>Sarlavha *</p>
                        <Tabs defaultValue="uz">
                            <TabsList className='w-full'>
                                <TabsTrigger value="uz">O'zbek</TabsTrigger>
                                <TabsTrigger value="ru">Русскй</TabsTrigger>
                                <TabsTrigger value="en">English</TabsTrigger>
                            </TabsList>
                            <TabsContent value="uz">
                                <FormField
                                    control={form.control}
                                    name="titleUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sarlavha (O'zbek tilida) *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="O'zbek tilidagi sarlavha kiriting" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                            <TabsContent value="ru">
                                <FormField
                                    control={form.control}
                                    name="titleRu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sarlavha (Rus tilida) *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Введите название на русском языке." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                            <TabsContent value="en">
                                <FormField
                                    control={form.control}
                                    name="titleEn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sarlavha (Engliz tilida) *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter a title in English." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className='p-5 border border-gray-300 rounded-xl space-y-6'>
                        <p className='font-semibold text-xl pb-2'>Tavsif *</p>
                        <Tabs defaultValue="uz">
                            <TabsList className='w-full'>
                                <TabsTrigger value="uz">O'zbek</TabsTrigger>
                                <TabsTrigger value="ru">Русскй</TabsTrigger>
                                <TabsTrigger value="en">English</TabsTrigger>
                            </TabsList>
                            <TabsContent value="uz">
                                <FormField
                                    control={form.control}
                                    name="descriptionUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tavsif (O'zbek tilida) *</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="O'zbek tilidagi tavsif kiriting" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                            <TabsContent value="ru">
                                <FormField
                                    control={form.control}
                                    name="descriptionRu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tavsif (Rus tilida) *</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Введите описание на русском языке." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                            <TabsContent value="en">
                                <FormField
                                    control={form.control}
                                    name="descriptionEn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tavsif (Engliz tilida) *</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter a description in English." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className='flex justify-end'>
                        <div className='flex items-center gap-4'>
                            <Button type="button" variant={'outline'} onClick={handleCancel}>
                                Bekor qilish
                            </Button>
                            <Button disabled={loading} type="submit">Yangilik yaratish</Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default CreateNews;