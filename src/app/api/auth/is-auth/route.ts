// app/api/auth/is-auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { isAuthenticated: false, admin: null },
        { status: 200 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { isAuthenticated: false, admin: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      isAuthenticated: true,
      admin: {
        id: payload.adminId,
        email: payload.email,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { isAuthenticated: false, admin: null },
      { status: 200 }
    );
  }
}
