import { v2 as cloudinary } from "cloudinary";

// Cloudinary konfiguratsiyasi
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Rasm yuklash funksiyasi
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    // File ni arrayBuffer ga o'tkazish
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Base64 ga o'tkazish
    const base64String = `data:${file.type};base64,${buffer.toString(
      "base64"
    )}`;

    // Cloudinary ga yuklash
    const result = await cloudinary.uploader.upload(base64String, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || "news_uploads",
      folder: "news-images",
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary yuklashda xatolik:", error);
    throw new Error("Rasm yuklash muvaffaqiyatsiz");
  }
};

// Rasm o'chirish funksiyasi
export const deleteImageFromCloudinary = async (url: string): Promise<void> => {
  try {
    // URL dan public_id ni olish
    const publicId = extractPublicIdFromUrl(url);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error("Cloudinary dan o'chirishda xatolik:", error);
  }
};

// URL dan public_id ni olish
const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
    return matches ? matches[1] : null;
  } catch (error) {
    console.error("Public ID ni olishda xatolik:", error);
    return null;
  }
};
