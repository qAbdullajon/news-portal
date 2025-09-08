import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      include: { content: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Text ma'lumotlarni olish
    const slug = formData.get("slug") as string;
    const sendUrl = formData.get("sendUrl") as string;
    const titleUz = formData.get("titleUz") as string;
    const titleRu = formData.get("titleRu") as string;
    const titleEn = formData.get("titleEn") as string;
    const descriptionUz = formData.get("descriptionUz") as string;
    const descriptionRu = formData.get("descriptionRu") as string;
    const descriptionEn = formData.get("descriptionEn") as string;
    const published = formData.get("published") === "true";

    // JSON ma'lumotlarni parse qilish
    const contentString = formData.get("content") as string;
    const content = contentString ? JSON.parse(contentString) : [];

    // Rasmni Cloudinary ga yuklash
    const imageFile = formData.get("image") as File;
    let imageUrl = "";

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      imageUrl = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "news-portal",
              transformation: [
                { width: 1200, height: 630, crop: "fill" },
                { quality: "auto" },
                { format: "webp" },
              ],
            },
            (error, result) => {
              if (error) {
                reject(error);
                return;
              }
              resolve(result!.secure_url);
            }
          )
          .end(buffer);
      });
    }

    // Content blocklardagi rasmlarni yuklash
    const processedContent = await Promise.all(
      content.map(async (block: any) => {
        if (block.type === "IMAGE" && block.images && block.images.length > 0) {
          const imageUploadPromises = block.images.map(async (img: any) => {
            if (img.file) {
              const arrayBuffer = await img.file.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);

              return new Promise<string>((resolve, reject) => {
                cloudinary.uploader
                  .upload_stream(
                    {
                      folder: "news-portal/content",
                      transformation: [
                        { width: 800, crop: "scale" },
                        { quality: "auto" },
                        { format: "webp" },
                      ],
                    },
                    (error, result) => {
                      if (error) {
                        reject(error);
                        return;
                      }
                      resolve(result!.secure_url);
                    }
                  )
                  .end(buffer);
              });
            }
            return img; // Agar file emas, URL bo'lsa
          });

          const uploadedImages = await Promise.all(imageUploadPromises);
          return {
            ...block,
            images: uploadedImages,
          };
        }
        return block;
      })
    );

    // Databasega saqlash
    const news = await prisma.news.create({
      data: {
        slug,
        image: imageUrl,
        sendUrl,
        titleUz,
        titleEn,
        titleRu,
        descriptionUz,
        descriptionEn,
        descriptionRu,
        published,
        content: {
          create: processedContent.map((block: any, index: number) => ({
            type: block.type,
            contentUz: block.content?.uz,
            contentEn: block.content?.en,
            contentRu: block.content?.ru,
            images: block.images || [],
            linkUrl: block.linkUrl,
            linkTitle: block.linkTitle,
            order: index,
          })),
        },
      },
      include: { content: true },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error("Xato:", error);
    return NextResponse.json(
      { error: "Yangilik yaratishda xatolik" },
      { status: 500 }
    );
  }
}
