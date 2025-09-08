'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ContentBlock, BlockType, NewsTranslation } from '@/types/type';

export interface NewsFormData {
    id?: string;
    slug: string;
    image: File | null;
    imagePreview: string | null;
    sendUrl: string;
    title: NewsTranslation;
    description: NewsTranslation;
    content: ContentBlock[];
    published: boolean;
}

interface NewsFormContextType {
    formData: NewsFormData;
    setFormData: React.Dispatch<React.SetStateAction<NewsFormData>>;
    addContentBlock: (type: BlockType) => void;
    updateContentBlock: (index: number, updates: Partial<ContentBlock>) => void;
    removeContentBlock: (index: number) => void;
    moveContentBlock: (fromIndex: number, toIndex: number) => void;
    resetForm: () => void;
}

const NewsFormContext = createContext<NewsFormContextType | undefined>(undefined);

const initialFormData: NewsFormData = {
    slug: '',
    image: null,
    imagePreview: null,
    sendUrl: '',
    title: { uz: '', ru: '', en: '' },
    description: { uz: '', ru: '', en: '' },
    content: [],
    published: false,
};

export function NewsFormProvider({ children }: { children: ReactNode }) {
    const [formData, setFormData] = useState<NewsFormData>(initialFormData);

    const addContentBlock = (type: BlockType) => {
        const newBlock: ContentBlock = {
            id: Date.now().toString(),
            type,
            order: formData.content.length,
            content: type === 'TEXT' ? { uz: '', ru: '', en: '' } : undefined,
            images: type === 'IMAGE' ? [] : undefined,
            linkUrl: type === 'LINK' ? '' : undefined,
            linkTitle: type === 'LINK' ? '' : undefined,
            newsId: '', // Bu keyin to'ldiriladi
        };

        setFormData(prev => ({
            ...prev,
            content: [...prev.content, newBlock]
        }));
    };

    const updateContentBlock = (index: number, updates: Partial<ContentBlock>) => {
        setFormData(prev => {
            const updatedContent = [...prev.content];
            updatedContent[index] = { ...updatedContent[index], ...updates };
            return { ...prev, content: updatedContent };
        });
    };

    const removeContentBlock = (index: number) => {
        setFormData(prev => ({
            ...prev,
            content: prev.content.filter((_, i) => i !== index)
        }));
    };

    const moveContentBlock = (fromIndex: number, toIndex: number) => {
        setFormData(prev => {
            const newContent = [...prev.content];
            const [movedBlock] = newContent.splice(fromIndex, 1);
            newContent.splice(toIndex, 0, movedBlock);

            // Tartiblarni yangilash
            newContent.forEach((block, index) => {
                block.order = index;
            });

            return { ...prev, content: newContent };
        });
    };

    const resetForm = () => {
        setFormData(initialFormData);
    };

    const value = {
        formData,
        setFormData,
        addContentBlock,
        updateContentBlock,
        removeContentBlock,
        moveContentBlock,
        resetForm,
    };

    return (
        <NewsFormContext.Provider value={value}>
            {children}
        </NewsFormContext.Provider>
    );
}

export function useNewsForm() {
    const context = useContext(NewsFormContext);
    if (context === undefined) {
        throw new Error('useNewsForm must be used within a NewsFormProvider');
    }
    return context;
}