"use client";

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ArrowDown, ArrowUp, Eye, EyeOff, Image as ImageIcon, Link as LinkIcon, Save, Trash2, Type, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { format } from 'date-fns'

interface ImageItem {
    id: string;
    file: File;
    preview: string;
    order: number;
}

interface TextBlock {
    id: string;
    type: 'text';
    content: {
        uz: string;
        ru: string;
        en: string;
    };
    order: number;
}

interface LinkBlock {
    id: string;
    type: 'link';
    content: {
        uz: string;
        ru: string;
        en: string;
    };
    url: string;
    order: number;
}

interface ImageBlock {
    id: string;
    type: 'image';
    images: ImageItem[];
    order: number;
}

interface CurrentNew {
    content: string
    createdAt: string
    descriptionEn: string
    descriptionRu: string
    descriptionUz: string
    id: string
    image: string
    published: string
    sendUrl: string
    slug: string
    titleEn: string
    titleRu: string
    titleUz: string
    updatedAt: string
}

type ContentBlock = TextBlock | LinkBlock | ImageBlock;

const EditNews = () => {
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [nextId, setNextId] = useState(1);
    const params = useParams()
    const [currentNew, setCurrentNew] = useState<CurrentNew | null>(null)
    const [isLoading, setIsLoading] = useState(false);

    // Yangi blok qo'shish funksiyalari
    const addTextBlock = () => {
        const newBlock: TextBlock = {
            id: `block-${nextId}`,
            type: 'text',
            content: { uz: '', ru: '', en: '' },
            order: blocks.length
        };
        setBlocks([...blocks, newBlock]);
        setNextId(nextId + 1);
    };

    const addLinkBlock = () => {
        const newBlock: LinkBlock = {
            id: `block-${nextId}`,
            type: 'link',
            content: { uz: '', ru: '', en: '' },
            url: '',
            order: blocks.length
        };
        setBlocks([...blocks, newBlock]);
        setNextId(nextId + 1);
    };

    const addImageBlock = () => {
        const newBlock: ImageBlock = {
            id: `block-${nextId}`,
            type: 'image',
            images: [],
            order: blocks.length
        };
        setBlocks([...blocks, newBlock]);
        setNextId(nextId + 1);
    };

    // Bloklarni o'chirish
    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(block => block.id !== id));
    };

    // Bloklarni siljitish
    const moveBlockUp = (index: number) => {
        if (index === 0) return;

        const newBlocks = [...blocks];
        [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
        setBlocks(newBlocks);
    };

    const moveBlockDown = (index: number) => {
        if (index === blocks.length - 1) return;

        const newBlocks = [...blocks];
        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        setBlocks(newBlocks);
    };

    // Rasm qo'shish (faqat image bloklari uchun)
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, blockId: string) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        const updatedBlocks = blocks.map(block => {
            if (block.id === blockId && block.type === 'image') {
                const newImages = files.map(file => ({
                    id: Math.random().toString(36).substr(2, 9),
                    file,
                    preview: URL.createObjectURL(file),
                    order: block.images.length
                }));

                return {
                    ...block,
                    images: [...block.images, ...newImages]
                };
            }
            return block;
        });

        setBlocks(updatedBlocks);
        e.target.value = ''; // Inputni tozalash
    };

    // Rasmlarni o'chirish
    const removeImage = (blockId: string, imageId: string) => {
        const updatedBlocks = blocks.map(block => {
            if (block.id === blockId && block.type === 'image') {
                return {
                    ...block,
                    images: block.images.filter(img => img.id !== imageId)
                };
            }
            return block;
        });

        setBlocks(updatedBlocks);
    };

    // Matn bloklarini yangilash
    const updateTextContent = (blockId: string, lang: 'uz' | 'ru' | 'en', value: string) => {
        const updatedBlocks = blocks.map(block => {
            if (block.id === blockId && block.type === 'text') {
                return {
                    ...block,
                    content: {
                        ...block.content,
                        [lang]: value
                    }
                };
            }
            return block;
        });

        setBlocks(updatedBlocks);
    };

    // Havola bloklarini yangilash
    const updateLinkContent = (blockId: string, lang: 'uz' | 'ru' | 'en', value: string) => {
        const updatedBlocks = blocks.map(block => {
            if (block.id === blockId && block.type === 'link') {
                return {
                    ...block,
                    content: {
                        ...block.content,
                        [lang]: value
                    }
                };
            }
            return block;
        });

        setBlocks(updatedBlocks);
    };

    // Havola URL ni yangilash
    const updateLinkUrl = (blockId: string, value: string) => {
        const updatedBlocks = blocks.map(block => {
            if (block.id === blockId && block.type === 'link') {
                return {
                    ...block,
                    url: value
                };
            }
            return block;
        });

        setBlocks(updatedBlocks);
    };

    useEffect(() => {
        const findNews = async () => {
            try {
                const response = await fetch(`/api/admin/news/${params.id}`, {
                    method: 'GET',
                });
                if (response.ok) {
                    const result = await response.json();
                    setCurrentNew(result);

                    // Content bloklarini frontend formatiga o'tkazish
                    if (result.content && Array.isArray(result.content)) {
                        const formattedBlocks = result.content.map((block: any) => {
                            // BlockType ni frontend formatiga o'tkazish
                            let blockType: 'text' | 'image' | 'link';
                            switch (block.type) {
                                case 'TEXT':
                                    blockType = 'text';
                                    break;
                                case 'IMAGE':
                                    blockType = 'image';
                                    break;
                                case 'LINK':
                                    blockType = 'link';
                                    break;
                                default:
                                    blockType = 'text';
                            }

                            if (blockType === 'text') {
                                return {
                                    id: block.id || `block-${Math.random().toString(36).substr(2, 9)}`,
                                    type: 'text',
                                    content: {
                                        uz: block.contentUz || '',
                                        ru: block.contentRu || '',
                                        en: block.contentEn || ''
                                    },
                                    order: block.order || 0
                                } as TextBlock;
                            } else if (blockType === 'link') {
                                return {
                                    id: block.id || `block-${Math.random().toString(36).substr(2, 9)}`,
                                    type: 'link',
                                    content: {
                                        uz: block.contentUz || '',
                                        ru: block.contentRu || '',
                                        en: block.contentEn || ''
                                    },
                                    url: block.linkUrl || '',
                                    order: block.order || 0
                                } as LinkBlock;
                            } else if (blockType === 'image') {
                                // Yangilangan qism: images arrayini to'g'ri formatlash
                                const imageItems: ImageItem[] = [];

                                if (block.images && Array.isArray(block.images)) {
                                    block.images.forEach((imgUrl: string, index: number) => {
                                        if (typeof imgUrl === 'string') {
                                            imageItems.push({
                                                id: `img-${Math.random().toString(36).substr(2, 9)}`,
                                                file: new File([], `image-${index}`, { type: 'image/jpeg' }),
                                                preview: imgUrl,
                                                order: index
                                            });
                                        }
                                    });
                                }

                                return {
                                    id: block.id || `block-${Math.random().toString(36).substr(2, 9)}`,
                                    type: 'image',
                                    images: imageItems,
                                    order: block.order || 0
                                } as ImageBlock;
                            }
                            return null;
                        }).filter(Boolean) as ContentBlock[];

                        setBlocks(formattedBlocks);
                        setNextId(formattedBlocks.length + 1);
                    }
                } else {
                    const errorData = await response.json();
                    console.error('Server error:', errorData);
                    toast.error('Yangilikni yuklashda xatolik');
                }
            } catch (error) {
                console.error('Network error:', error);
                toast.error('Tarmoq xatosi');
            }
        };
        findNews();
    }, [params.id]);

    // Yangi funksiya - rasmlarni Cloudinary ga yuklash
    const uploadImageToCloudinary = async (file: File): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "news_uploads");

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                const data = await response.json();
                return data.secure_url; // Cloudinary dan qaytgan URL
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Rasm yuklash muvaffaqiyatsiz");
            }
        } catch (error) {
            console.error("Cloudinary yuklashda xatolik:", error);
            throw error;
        }
    };

    // Yangi handleSave funksiyasi
    const handleSave = async () => {
        if (!currentNew) return;

        setIsLoading(true);
        try {
            // 1. Yangi yuklangan rasmlarni Cloudinary ga yuklash
            const uploadPromises: Promise<void>[] = [];
            const blocksWithUploadedImages = [...blocks];
            const uploadedImages: { blockIndex: number, imageIndex: number, url: string }[] = [];


            for (let i = 0; i < blocksWithUploadedImages.length; i++) {
                const block = blocksWithUploadedImages[i];
                if (block.type === "image") {
                    for (let j = 0; j < block.images.length; j++) {
                        const image = block.images[j];
                        if (image.preview.startsWith("blob:")) {
                            uploadPromises.push(
                                uploadImageToCloudinary(image.file)
                                    .then((cloudinaryUrl) => {
                                        uploadedImages.push({ blockIndex: i, imageIndex: j, url: cloudinaryUrl });
                                    })
                                    .catch((error) => {
                                        console.error("Rasm yuklashda xatolik:", error);
                                        toast.error(`Rasm yuklashda xatolik: ${error.message}`);
                                    })
                            );
                        }
                    }
                }
            }

            // 2. Barcha rasmlar yuklanishini kutish
            await Promise.all(uploadPromises);

            // 3. Yangilangan bloklarni saqlash
            setBlocks(blocksWithUploadedImages);

            // 4. Content bloklarini formatlash
            const formattedBlocks = blocksWithUploadedImages.map((block, index) => {
                const baseBlock = {
                    type: block.type,
                    order: index,
                };

                if (block.type === "text") {
                    return {
                        ...baseBlock,
                        contentUz: block.content.uz,
                        contentEn: block.content.en,
                        contentRu: block.content.ru,
                    };
                } else if (block.type === "link") {
                    return {
                        ...baseBlock,
                        contentUz: block.content.uz,
                        contentEn: block.content.en,
                        contentRu: block.content.ru,
                        linkUrl: block.url,
                    };
                } else if (block.type === "image") {
                    // Faqat Cloudinary URL larni yuborish
                    return {
                        ...baseBlock,
                        contentUz: "",
                        contentEn: "",
                        contentRu: "",
                        images: block.images.map((img) => img.preview), // Cloudinary URL lari
                    };
                }
                return baseBlock;
            });

            // 5. Ma'lumotlarni serverga yuborish
            const requestBody = {
                slug: currentNew.slug,
                image: currentNew.image,
                sendUrl: currentNew.sendUrl,
                titleUz: currentNew.titleUz,
                titleEn: currentNew.titleEn,
                titleRu: currentNew.titleRu,
                descriptionUz: currentNew.descriptionUz,
                descriptionEn: currentNew.descriptionEn,
                descriptionRu: currentNew.descriptionRu,
                published: currentNew.published,
                content: formattedBlocks,
            };

            const response = await fetch(`/api/admin/news/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success("Yangilik muvaffaqiyatli saqlandi");

                // Yangilangan ma'lumotlarni state ga o'rnatish
                setCurrentNew(result);

            } else {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                toast.error("Yangilikni saqlashda xatolik: " + (errorData.error || "Noma'lum xato"));
            }
        } catch (error) {
            console.error("Network error:", error);
            toast.error("Tarmoq xatosi");
        } finally {
            setIsLoading(false);
        }
    };
    const togglePublishStatus = async () => {
        if (!currentNew) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/news/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...currentNew,
                    published: !currentNew.published
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setCurrentNew(result);
                toast.success(`Yangilik ${result.published ? 'nashr qilindi' : 'nashrdan olindi'}`);
            } else {
                const errorData = await response.json();
                console.error('Server error:', errorData);
                toast.error('Holatni o\'zgartirishda xatolik');
            }
        } catch (error) {
            console.error('Network error:', error);
            toast.error('Tarmoq xatosi');
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentNew) {
        return <div className="max-w-5xl mx-auto p-5">Yuklanmoqda...</div>;
    }

    return (
        <div className='max-w-5xl mx-auto space-y-5'>
            <div className='border border-gray-300 rounded-xl py-4'>
                <div className='bg-amber-500 text-white flex items-center gap-3 py-1 px-10'>
                    <div className='bg-white/30 w-8 h-8 flex items-center justify-center rounded-sm'>
                        <Type size={18} />
                    </div>
                    <p className='text-xl font-semibold'>Yangilik ma'lumotlari</p>
                </div>

                <div className='grid grid-cols-3 px-10 py-8 gap-y-6'>
                    <div className='space-y-3'>
                        <p>Holati</p>
                        <span className={`text-xs ${currentNew.published ? 'bg-black' : 'bg-amber-700'} text-white py-1 px-3 rounded-sm`}>{currentNew.published ? 'Nashr qilingan' : 'Nashr qilinmagan'}</span>
                    </div>
                    <div className='space-y-3'>
                        <p>Yaratilgan sanasi</p>
                        <span className='text-sm font-semibold'>{format(new Date(currentNew.createdAt), 'yyyy-MM-dd')}</span>
                    </div>
                    <div className='space-y-3'>
                        <p>Slug</p>
                        <p className='text-sm font-normal bg-gray-200 px-3 py-1 rounded-sm'>{currentNew.slug}</p>
                    </div>
                    <div className='space-y-3'>
                        <p>Sarlavha (Inglizcha)</p>
                        <p className='text-sm capitalize font-semibold'>{currentNew.titleEn}</p>
                    </div>
                </div>
            </div>

            <div className='border border-gray-300 rounded-xl py-4'>
                <div className='bg-amber-500 text-white flex items-center justify-between py-1 px-10'>
                    <div className='flex items-center gap-3'>
                        <div className='bg-white/30 w-8 h-8 flex items-center justify-center rounded-sm'>
                            <Type size={18} />
                        </div>
                        <p className='text-xl font-semibold'>Kontent blocklari</p>
                    </div>
                    <div className='flex items-center gap-4'>
                        <Button
                            variant={'outline'}
                            className='text-white bg-white/30 hover:bg-white/10 hover:text-orange-950 flex items-center gap-4'
                            onClick={addTextBlock}
                        >
                            <Type size={18} />
                            <p>Matn</p>
                        </Button>
                        <Button
                            variant={'outline'}
                            className='text-white bg-white/30 hover:bg-white/10 hover:text-orange-950 flex items-center gap-4'
                            onClick={addImageBlock}
                        >
                            <ImageIcon size={18} />
                            <p>Rasm</p>
                        </Button>
                        <Button
                            variant={'outline'}
                            className='text-white bg-white/30 hover:bg-white/10 hover:text-orange-950 flex items-center gap-4'
                            onClick={addLinkBlock}
                        >
                            <LinkIcon size={18} />
                            <p>Havola</p>
                        </Button>
                    </div>
                </div>

                <div className='p-5 space-y-5'>
                    {blocks.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-xl">
                            <p className="text-gray-500">Hali hech qanday blok qo'shilmagan</p>
                            <p className="text-sm text-gray-400 mt-2">Yuqoridagi tugmalar yordamida blok qo'shing</p>
                        </div>
                    )}

                    {blocks.map((block, index) => (
                        <div key={block.id} className='border-2 border-amber-300 border-dashed rounded-2xl p-5 space-y-8'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-8 h-8 flex items-center justify-center rounded-sm bg-amber-200 text-amber-600'>
                                        {block.type === 'text' && <Type size={18} />}
                                        {block.type === 'image' && <ImageIcon size={18} />}
                                        {block.type === 'link' && <LinkIcon size={18} />}
                                    </div>
                                    <div>
                                        <p className='leading-4'>
                                            {block.type === 'text' && 'Matn Bloki'}
                                            {block.type === 'image' && 'Rasm Gallereyasi'}
                                            {block.type === 'link' && 'Havola Bloki'}
                                        </p>
                                        <p className='text-sm text-gray-400'>#{index + 1}</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4'>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 bg-gray-100 text-gray-500"
                                        onClick={() => moveBlockUp(index)}
                                        disabled={index === 0}
                                    >
                                        <ArrowUp size={18} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 bg-gray-100 text-gray-500"
                                        onClick={() => moveBlockDown(index)}
                                        disabled={index === blocks.length - 1}
                                    >
                                        <ArrowDown size={18} />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => removeBlock(block.id)}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </div>

                            {block.type === 'text' && (
                                <Tabs defaultValue="uz">
                                    <TabsList className='w-full mb-3'>
                                        <TabsTrigger value="uz">O'zbek</TabsTrigger>
                                        <TabsTrigger value="ru">Русский</TabsTrigger>
                                        <TabsTrigger value="en">English</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="uz">
                                        <Textarea
                                            placeholder="O'zbekcha matn kiriting..."
                                            value={block.content.uz}
                                            onChange={(e) => updateTextContent(block.id, 'uz', e.target.value)}
                                        />
                                    </TabsContent>
                                    <TabsContent value="ru">
                                        <Textarea
                                            placeholder="Введите текст на русском языке..."
                                            value={block.content.ru}
                                            onChange={(e) => updateTextContent(block.id, 'ru', e.target.value)}
                                        />
                                    </TabsContent>
                                    <TabsContent value="en">
                                        <Textarea
                                            placeholder="Enter text in English..."
                                            value={block.content.en}
                                            onChange={(e) => updateTextContent(block.id, 'en', e.target.value)}
                                        />
                                    </TabsContent>
                                </Tabs>
                            )}

                            {block.type === 'link' && (
                                <>
                                    <div className='px-3 my-8 py-4 rounded-xl bg-gray-50'>
                                        <Label>Havola manzili</Label>
                                        <Input
                                            className='mt-3'
                                            placeholder='https://example.com'
                                            value={block.url}
                                            onChange={(e) => updateLinkUrl(block.id, e.target.value)}
                                        />
                                        <p className='text-xs text-gray-400 pt-1'>To'liq URL manzilini kiriting (https:// bilan)</p>
                                    </div>

                                    <Tabs defaultValue="uz">
                                        <TabsList className='w-full mb-3'>
                                            <TabsTrigger value="uz">O'zbek</TabsTrigger>
                                            <TabsTrigger value="ru">Русский</TabsTrigger>
                                            <TabsTrigger value="en">English</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="uz">
                                            <Label className='pb-2'>Havola nomi (O'zbekcha)</Label>
                                            <Input
                                                placeholder="Havola nomini o'zbekcha kiriting"
                                                value={block.content.uz}
                                                onChange={(e) => updateLinkContent(block.id, 'uz', e.target.value)}
                                            />
                                        </TabsContent>
                                        <TabsContent value="ru">
                                            <Label className='pb-2'>Havola nomi (Ruscha)</Label>
                                            <Input
                                                placeholder="Введите название ссылки на русском языке."
                                                value={block.content.ru}
                                                onChange={(e) => updateLinkContent(block.id, 'ru', e.target.value)}
                                            />
                                        </TabsContent>
                                        <TabsContent value="en">
                                            <Label className='pb-2'>Havola nomi (Inglizcha)</Label>
                                            <Input
                                                placeholder="Enter the link name in English."
                                                value={block.content.en}
                                                onChange={(e) => updateLinkContent(block.id, 'en', e.target.value)}
                                            />
                                        </TabsContent>
                                    </Tabs>
                                </>
                            )}

                            {block.type === 'image' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {block.images.map((image, imgIndex) => (
                                            <div key={image.id} className="relative group">
                                                <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
                                                    <img
                                                        src={image.preview}
                                                        alt={`Rasm ${imgIndex + 1}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => removeImage(block.id, image.id)}
                                                    >
                                                        <X size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}

                                        <div
                                            className="border-2 border-dashed border-gray-300 rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <ImageIcon size={24} className="text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500">Rasm qo'shish</span>
                                        </div>
                                    </div>

                                    <div className="hidden">
                                        <Input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, block.id)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex justify-end'>
                <div className='flex items-center gap-4'>
                    <span className={`text-xs ${currentNew.published ? 'bg-black' : 'bg-amber-700'} text-white py-1 px-3 rounded-sm`}>{currentNew.published ? 'Nashr qilingan' : 'Nashr qilinmagan'}</span>
                    <Button
                        onClick={handleSave}
                        className='flex items-center gap-2'
                        variant={'outline'}
                        disabled={isLoading}
                    >
                        <Save size={18} />
                        <p>{isLoading ? 'Saqlanmoqda...' : 'Saqlash'}</p>
                    </Button>
                    <Button
                        className='bg-amber-600 hover:bg-amber-600/90 flex items-center gap-2'
                        onClick={togglePublishStatus}
                        disabled={isLoading}
                    >
                        {currentNew.published ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                        <p>{currentNew.published ? 'Nashrdan chiqarish' : 'Nashr qilish'}</p>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditNews;