import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const findNew = await prisma.news.findUnique({
      where: { slug }, // id unique bo‘lishi kerak
      include: {
        content: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(findNew);
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
