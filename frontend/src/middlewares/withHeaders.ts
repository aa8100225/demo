import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server"

import { MiddlewareFactory } from "./types"

export const withHeaders: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64")
    const apiHOST = `${process.env.NEXT_PUBLIC_API_URL}`.replace(/\/api/g, '');
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}';
      style-src 'self' 'nonce-${nonce}' ;
      img-src 'self' blob: data:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
      connect-src 'self' ${apiHOST};
  `
    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader
      .replace(/\s{2,}/g, " ")
      .trim()

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-nonce", nonce)

    requestHeaders.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue
    )

    // const res = NextResponse.next({
    //   request: {
    //     headers: requestHeaders,
    //   },
    // });
    const res = await next(request, _next)

    if (res) {
      res.headers.set("x-nonce", nonce)
      res.headers.set("x-content-type-options", "nosniff")
      res.headers.set("x-dns-prefetch-control", "false")
      res.headers.set("x-download-options", "noopen")
      res.headers.set("x-frame-options", "SAMEORIGIN")
      if (process.env.NODE_ENV === "production") {
        res.headers.set(
          "Content-Security-Policy",
          contentSecurityPolicyHeaderValue
        )
      }
    }

    return res
  }
}
