// /api/admin/upload-cloudinary/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary konfiguratsiyasi
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Fayl topilmadi" }, { status: 400 });
    }

    // File ni buffer ga o'tkazish
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Base64 ga o'tkazish
    const base64String = `data:${file.type};base64,${buffer.toString(
      "base64"
    )}`;

    // Cloudinary ga yuklash
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "news-images",
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Yuklashda xatolik:", error);
    return NextResponse.json(
      { error: "Fayl yuklashda xatolik" },
      { status: 500 }
    );
  }
}
