import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const news = await prisma.news.findUnique({
      where: { id },
      include: { content: { orderBy: { order: "asc" } } },
    });

    if (!news) {
      return NextResponse.json(
        { error: "Yangilik topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Slug unikal ekanligini tekshirish
    if (body.slug) {
      const existingNews = await prisma.news.findFirst({
        where: {
          slug: body.slug,
          id: { not: id },
        },
      });

      if (existingNews) {
        return NextResponse.json(
          { error: "Bu slug allaqachon mavjud" },
          { status: 400 }
        );
      }
    }

    // Avvalgi content bloklarini olish (rasmlarni o'chirish uchun)
    const existingNews = await prisma.news.findUnique({
      where: { id },
      include: { content: true },
    });

    // Avval mavjud content bloklarini o'chiramiz
    await prisma.contentBlock.deleteMany({
      where: { newsId: id },
    });

    // Eski rasmlarni Cloudinary dan o'chirish
    if (existingNews?.content) {
      for (const block of existingNews.content) {
        if (block.type === "IMAGE" && block.images.length > 0) {
          for (const imageUrl of block.images) {
            await deleteImageFromCloudinary(imageUrl);
          }
        }
      }
    }

    // Yangi ma'lumotlarni yangilaymiz
    const news = await prisma.news.update({
      where: { id },
      data: {
        slug: body.slug,
        image: body.image,
        sendUrl: body.sendUrl,
        titleUz: body.titleUz,
        titleEn: body.titleEn,
        titleRu: body.titleRu,
        descriptionUz: body.descriptionUz,
        descriptionEn: body.descriptionEn,
        descriptionRu: body.descriptionRu,
        published: body.published,
        content: {
          create:
            body.content?.map((block: any, index: number) => {
              // BlockType ni to'g'ri formatga o'tkazish
              let blockType: any;
              switch (block.type?.toLowerCase()) {
                case "text":
                  blockType = "TEXT";
                  break;
                case "image":
                  blockType = "IMAGE";
                  break;
                case "link":
                  blockType = "LINK";
                  break;
                default:
                  blockType = "TEXT";
              }

              return {
                type: blockType,
                contentUz: block.contentUz || "",
                contentEn: block.contentEn || "",
                contentRu: block.contentRu || "",
                images: block.images || [], // Cloudinary URL lari
                linkUrl: block.linkUrl || "",
                order: index,
              };
            }) || [],
        },
      },
      include: { content: true },
    });

    return NextResponse.json(news);
  } catch (error: any) {
    console.error("Xato:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Bu slug allaqachon mavjud" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Yangilikni yangilashda xatolik: " + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Yangilik o'chirildi" });
  } catch (error) {
    return NextResponse.json(
      { error: "Yangilikni o'chirishda xatolik" },
      { status: 500 }
    );
  }
}
