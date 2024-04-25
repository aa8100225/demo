import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseFilters,
  HttpException,
} from "@nestjs/common"
import { UsersService } from "./users.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { HttpErrorFilter } from "src/common/http-error.filter"
import { CommonResponse } from "src/common/types/response.types"

@Controller("/api/users")
@UseFilters(HttpErrorFilter)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<CommonResponse<boolean>> {
    try {
      await this.usersService.create(createUserDto)
      return { message: "User registration successful", data: true }
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
