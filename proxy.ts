import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const url = req.nextUrl
  const hostname = req.headers.get("host") || ""
  
  // Is this an admin domain request?
  // Admin if it's the vercel.app deployment, or if localhost has 'admin.' prefix.
  const isAdminDomain = hostname.includes("vercel.app") || hostname.startsWith("admin.") || hostname.includes("admin.localhost")
  
  const isLoggedIn = !!req.auth
  const pathname = url.pathname

  // 1. Handle Admin Domain
  if (isAdminDomain) {
    // If asking for root, rewrite to /admin
    if (pathname === "/") {
      url.pathname = "/admin"
      return NextResponse.rewrite(url)
    }
    
    // Auth guard for /admin routes (except login and api)
    if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !pathname.startsWith("/api/auth")) {
      if (!isLoggedIn) {
        url.pathname = "/admin/login"
        return NextResponse.redirect(url)
      }
    }
    
    // Rewrite all other requests on the admin domain to the /admin folder if they aren't already
    // Actually, if we type "admin.inkandinsight.in/dashboard", we want to rewrite to "/admin/dashboard"
    if (!pathname.startsWith("/admin") && !pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
      url.pathname = `/admin${pathname}`
      return NextResponse.rewrite(url)
    }
  } 
  // 2. Handle Public Domain (e.g. inktoinsight.online)
  else {
    // Prevent accessing /admin routes on the public domain (unless testing locally)
    if (pathname.startsWith("/admin") && !hostname.includes("localhost")) {
      url.pathname = "/404"
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
