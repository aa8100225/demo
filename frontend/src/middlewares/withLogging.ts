import { MiddlewareFactory } from "@/middlewares/types"
import { NextFetchEvent, NextRequest } from "next/server"

export const withLogging: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    return next(request, _next)
  }
}
