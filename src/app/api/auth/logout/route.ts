// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Response yaratish
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout muvaffaqiyatli amalga oshirildi",
      },
      { status: 200 }
    );

    // Token cookie ni tozalash
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Avvalgi sana - cookie ni o'chirish
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server xatosi",
      },
      { status: 500 }
    );
  }
}

// GET so'rovi ham qo'shib qo'yamiz
export async function GET() {
  return POST();
}
