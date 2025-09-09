// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateAdmin, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email va password kiritilishi shart" },
        { status: 400 }
      );
    }

    const admin = await validateAdmin(email, password);

    if (!admin) {
      return NextResponse.json(
        { error: "Email yoki password noto'g'ri" },
        { status: 401 }
      );
    }

    const token = generateToken({
      adminId: admin.id,
      email: admin.email,
    });

    const response = NextResponse.json(
      {
        message: "Login muvaffaqiyatli",
        admin: { id: admin.id, email: admin.email },
      },
      { status: 200 }
    );

    // HTTP-only cookie ni o'rnatish
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 kun
    });

    return response;
  } catch (error) {
    console.error("Login xatosi:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
