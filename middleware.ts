import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { AUTH } from "@/lib/constants";

export async function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  
  // Add Cache-Control for API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    requestHeaders.set("Cache-Control", "no-store, max-age=0");

    // Get the user token from the session
    const token = await getToken({ req, secret: AUTH.NEXTAUTH_SECRET });

    if (token?.accessToken) {
      requestHeaders.set("Authorization", `Bearer ${token.accessToken}`);
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: "/api/:path*", // Only applies to API routes
};