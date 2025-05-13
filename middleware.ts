import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const publicPaths = ["/", "/auth/login", "/auth/signup"];

  // Check if the path is public
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith("/api/")
  );

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect logic based on auth status
  if (isPublicPath && token) {
    // If user is authenticated and trying to access a public route
    // Redirect them to the dashboard
    if (pathname !== "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (!isPublicPath && !token) {
    // If user is not authenticated and trying to access a protected route
    // Redirect them to the login page
    return NextResponse.redirect(
      new URL(
        `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`,
        request.url
      )
    );
  }

  return NextResponse.next();
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /_next (Next.js internals)
     * 2. /api/auth (NextAuth.js API routes)
     * 3. /static (public assets)
     * 4. .*\\..*$ (files with extensions - i.e. images)
     */
    "/((?!_next|api/auth|static|.*\\..*$).*)",
  ],
};
