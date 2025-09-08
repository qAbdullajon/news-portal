export interface CartType {
  id: string;
  slug?: string;
  image: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  createdAt?: string;
  created_at?: string; // Eskisi bilan ham moslashish uchun
  updatedAt?: string;
  published?: boolean;
  sendUrl?: string;
  category?: string;
}

export type Language = "uz" | "ru" | "en";

export interface NewsTranslation {
  uz: string;
  ru: string;
  en: string;
}

export interface News {
  id: string;
  slug: string;
  image: string;
  sendUrl?: string;
  title: NewsTranslation;
  description: NewsTranslation;
  content: ContentBlock[];
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

export type BlockType = "TEXT" | "IMAGE" | "LINK";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content?: NewsTranslation;
  images?: string[];
  linkUrl?: string;
  linkTitle?: string;
  order: number;
  newsId: string;
}

export interface CreateNewsInput {
  slug: string;
  image: string;
  sendUrl?: string;
  title: NewsTranslation;
  description: NewsTranslation;
  content: Omit<ContentBlock, "id" | "newsId">[];
  published?: boolean;
}

export interface UpdateNewsInput extends Partial<CreateNewsInput> {}
