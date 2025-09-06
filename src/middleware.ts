// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const i18n = {
  defaultLocale: "uz",
  locales: ["uz", "ru", "en"],
};

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim());
    for (const lang of languages) {
      const primaryLang = lang.split("-")[0].toLowerCase();
      if (primaryLang === "uz") return "uz";
      if (primaryLang === "ru") return "ru";
      if (primaryLang === "en") return "en";
    }
  }

  return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Static fayllarni o'tkazib yuborish
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/admin/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Tilni aniqlash
  const locale = getLocale(request);

  // URLda til mavjudligini tekshirish
  const pathnameHasLocale = i18n.locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  // Agar URLda til mavjud bo'lmasa, tilni qo'shamiz
  if (!pathnameHasLocale) {
    // Asosiy sahifa uchun
    if (pathname === "/") {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    // Boshqa sahifalar uchun
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher:
    "/((?!api|admin|_next/static|_next/image|favicon.ico|images|icons).*)",
};
