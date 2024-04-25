import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseFilters,
} from "@nestjs/common"
import { LoginDto } from "./dto/login.dto"
import { AuthService } from "./auth.service"
import { Response } from "express"
import { HttpErrorFilter } from "src/common/http-error.filter"

@Controller("/api/auth")
@UseFilters(HttpErrorFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      const user = await this.authService.validateUser(
        loginDto.username,
        loginDto.password
      )
      const { access_token } = await this.authService.login(user)
      response.cookie("jwt", access_token, {
        httpOnly: true,
        path: "/",
        // 11 minutes. For testing scenarios where the token in the header has not disappeared but has expired.
        maxAge: 600 * 1000 + 60 * 1000,
        secure: process.env.NODE_ENV === "production",
      })
      response.status(HttpStatus.OK).json({
        message: "Login successful",
        data: user,
      })
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw new HttpException(error.getResponse(), error.getStatus())
      } else {
        throw new HttpException(
          "An unexpected error occurred",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
    }
  }
}
