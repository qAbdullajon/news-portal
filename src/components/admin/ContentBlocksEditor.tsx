'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNewsForm } from '@/contexts/NewsFormContext';
import { BlockType } from '@/types/type';
import ContentBlockItem from './ContentBlockItem';

const ContentBlocksEditor = () => {
    const { formData, addContentBlock, moveContentBlock } = useNewsForm();

    return (
        <div className='p-5 border border-gray-300 rounded-xl space-y-6'>
            <div className='flex justify-between items-center'>
                <p className='font-semibold text-xl'>Kontent Bloklari</p>
                <div className='flex gap-2'>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => addContentBlock('TEXT')}
                    >
                        Matn Qo'shish
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => addContentBlock('IMAGE')}
                    >
                        Rasm Qo'shish
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => addContentBlock('LINK')}
                    >
                        Havola Qo'shish
                    </Button>
                </div>
            </div>

            {formData.content.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-gray-500 text-center">
                            Hali hech qanday kontent bloki qo'shilmagan. Yuqoridagi tugmalar yordamida yangi blok qo'shing.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {formData.content.map((block, index) => (
                        <ContentBlockItem
                            key={block.id}
                            block={block}
                            index={index}
                            totalBlocks={formData.content.length}
                            onMoveUp={index > 0 ? () => moveContentBlock(index, index - 1) : undefined}
                            onMoveDown={index < formData.content.length - 1 ? () => moveContentBlock(index, index + 1) : undefined}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContentBlocksEditor;