import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/transactions",
  "/goals",
  "/chat",
  "/api/transactions",
  "/api/goals",
  "/api/chat",
  "/api/user",
]

// Define admin-only routes
const adminRoutes = [
  "/admin",
  "/api/admin",
]

// Define public routes that should redirect to dashboard if authenticated
const publicRoutes = [
  "/auth/signin",
  "/auth/signup",
  "/",
]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )
  const isAdminRoute = adminRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )
  const isPublicRoute = publicRoutes.some(route => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route)
  )

  // Redirect to sign-in if accessing protected route without authentication
  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL("/auth/signin", nextUrl.origin)
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check admin access
  if (isAdminRoute && (!isLoggedIn || userRole !== "admin")) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin))
  }

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && (nextUrl.pathname === "/auth/signin" || nextUrl.pathname === "/auth/signup")) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin))
  }

  // Redirect root to dashboard if authenticated, otherwise to sign-in
  if (nextUrl.pathname === "/") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl.origin))
    } else {
      return NextResponse.redirect(new URL("/auth/signin", nextUrl.origin))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}