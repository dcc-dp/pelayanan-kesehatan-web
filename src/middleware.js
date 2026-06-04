import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Proteksi role admin untuk semua halaman internal
    const isPublicPath = path === "/login" || path === "/" || path.startsWith("/api/auth");
    
    if (!isPublicPath && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Lindungi semua route KECUALI api, halaman login, halaman depan, file statis & internal Next.js
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|$).*)"
  ],
};
