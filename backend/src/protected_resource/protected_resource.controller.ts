import { Controller, Get, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("protected-resource")
export class ProtectedResourceController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getProtectedResource() {
    // test 401
    return { message: "Successfully Get This API , this route is protected" }
  }
}
