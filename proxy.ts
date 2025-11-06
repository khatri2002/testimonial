import { NextRequest, NextResponse } from "next/server";
import { auth } from "./app/auth";

const protectedRoutes = ["/dashboard"];
const publicOnlyRoutes = ["/sign-in", "/sign-up"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicOnlyRoute = publicOnlyRoutes.includes(path);

  const session = await auth();

  // redirect to /sign-in if the user is not authenticated
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  // redirect to /dashboard if the user is authenticated
  if (isPublicOnlyRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
