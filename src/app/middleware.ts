import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    const { pathname } = request.nextUrl;
    
    // Redirect authenticated users away from auth pages
    if (session && ["/login", "/signup"].includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch (error) {
    console.error("Middleware auth error:", error);
    // Continue if there's an error in auth check
  }
  
  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/login", "/signup"],
};
