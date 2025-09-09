// app/api/admin/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email va password kiritilishi shart" },
        { status: 400 }
      );
    }

    // Admin mavjudligini tekshirish
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Bu email bilan admin allaqachon mavjud" },
        { status: 409 }
      );
    }

    // Yangi admin yaratish
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password,
      },
    });

    const { password: _, ...adminWithoutPassword } = newAdmin;

    return NextResponse.json(
      {
        message: "Admin muvaffaqiyatli yaratildi",
        admin: adminWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin yaratish xatosi:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
