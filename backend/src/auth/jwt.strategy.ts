import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable } from "@nestjs/common"
import * as dotenv from "dotenv"
import { Request } from "express"
dotenv.config()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let access_token = null
          if (request && request.cookies) {
            access_token = request.cookies["jwt"]
          }
          return access_token
        },
      ]),
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: false,
    })
  }

  async validate(payload: any) {
    return { username: payload.username, name: payload.name }
  }

  // extractAccessTokenFromCookies(rawCookies: string | undefined | null) {
  // If we don't use app.use(cookieParser()), we have to parse the cookies ourselves.
  // const rawCookies = request.headers.cookie
  // if (!rawCookies) {
  //   return null
  // }
  // const parsedCookies = rawCookies.split(";").reduce(
  //   (acc, currentCookie) => {
  //     const [name, value] = currentCookie.split("=")
  //     acc[name] = value
  //     return acc
  //   },
  //   {} as { [key: string]: string }
  // )
  // return parsedCookies["jwt"]
  // }
}
