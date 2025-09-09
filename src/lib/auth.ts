// lib/auth.ts
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "sizning-maxfiy-kalitingiz";

export interface TokenPayload {
  adminId: string;
  email: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function validateAdmin(email: string, password: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (admin && admin.password === password) {
      const { password: _, ...adminWithoutPassword } = admin;
      return adminWithoutPassword;
    }

    return null;
  } catch (error) {
    console.error("Admin tekshirish xatosi:", error);
    throw error;
  }
}
