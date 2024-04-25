import { MiddlewareFactory } from "@/middlewares/types"
import { NextFetchEvent, NextRequest, NextResponse } from "next/server"

export const withAuthorization: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const { cookies } = request
    const path = request.nextUrl.pathname
    if (path === "/login" || path === "/register") {
      return next(request, _next)
    }
    const access_token = cookies.get("jwt")
    if (!access_token) {
      const url = new URL("/login", request.url)
      url.searchParams.append("session", "expired")
      return NextResponse.redirect(url)
    }
  }
}
