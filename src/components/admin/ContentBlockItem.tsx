'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNewsForm } from '@/contexts/NewsFormContext';
import { ContentBlock, BlockType } from '@/types/type';
import { MoveUp, MoveDown, Trash2 } from 'lucide-react';

interface ContentBlockItemProps {
    block: ContentBlock;
    index: number;
    totalBlocks: number;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}

const ContentBlockItem: React.FC<ContentBlockItemProps> = ({
    block,
    index,
    totalBlocks,
    onMoveUp,
    onMoveDown,
}) => {
    const { updateContentBlock, removeContentBlock } = useNewsForm();

    const handleContentChange = (lang: 'uz' | 'ru' | 'en', value: string) => {
        updateContentBlock(index, {
            content: {
                ...(block.content as { uz: string; ru: string; en: string }),
                [lang]: value
            }
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newImages = files.map(file => URL.createObjectURL(file));
        updateContentBlock(index, {
            images: [...(block.images || []), ...newImages]
        });
    };

    const removeImage = (imageIndex: number) => {
        updateContentBlock(index, {
            images: block.images?.filter((_, i) => i !== imageIndex)
        });
    };

    const handleLinkChange = (field: 'linkUrl' | 'linkTitle', value: string) => {
        updateContentBlock(index, {
            [field]: value
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">
                        {block.type === 'TEXT' && 'Matn Bloki'}
                        {block.type === 'IMAGE' && 'Rasm Bloki'}
                        {block.type === 'LINK' && 'Havola Bloki'}
                    </span>
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                </div>
                <div className="flex items-center gap-1">
                    {onMoveUp && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onMoveUp}
                            title="Yuqoriga ko'chirish"
                        >
                            <MoveUp className="h-4 w-4" />
                        </Button>
                    )}
                    {onMoveDown && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onMoveDown}
                            title="Pastga ko'chirish"
                        >
                            <MoveDown className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeContentBlock(index)}
                        title="O'chirish"
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {block.type === 'TEXT' && (
                    <Tabs defaultValue="uz">
                        <TabsList className="w-full">
                            <TabsTrigger value="uz">O'zbek</TabsTrigger>
                            <TabsTrigger value="ru">Русский</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                        </TabsList>
                        <TabsContent value="uz">
                            <Textarea
                                placeholder="Matn kiriting (O'zbekcha)"
                                value={block.content?.uz || ''}
                                onChange={(e) => handleContentChange('uz', e.target.value)}
                                rows={4}
                            />
                        </TabsContent>
                        <TabsContent value="ru">
                            <Textarea
                                placeholder="Введите текст (Русский)"
                                value={block.content?.ru || ''}
                                onChange={(e) => handleContentChange('ru', e.target.value)}
                                rows={4}
                            />
                        </TabsContent>
                        <TabsContent value="en">
                            <Textarea
                                placeholder="Enter text (English)"
                                value={block.content?.en || ''}
                                onChange={(e) => handleContentChange('en', e.target.value)}
                                rows={4}
                            />
                        </TabsContent>
                    </Tabs>
                )}

                {block.type === 'IMAGE' && (
                    <div className="space-y-4">
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />
                        {block.images && block.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {block.images.map((image, imgIndex) => (
                                    <div key={imgIndex} className="relative">
                                        <img
                                            src={image}
                                            alt={`Rasm ${imgIndex + 1}`}
                                            className="w-full h-24 object-cover rounded"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-6 w-6"
                                            onClick={() => removeImage(imgIndex)}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {block.type === 'LINK' && (
                    <div className="space-y-4">
                        <Input
                            placeholder="Havola URL"
                            value={block.linkUrl || ''}
                            onChange={(e) => handleLinkChange('linkUrl', e.target.value)}
                        />
                        <Input
                            placeholder="Havola sarlavhasi"
                            value={block.linkTitle || ''}
                            onChange={(e) => handleLinkChange('linkTitle', e.target.value)}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ContentBlockItem;