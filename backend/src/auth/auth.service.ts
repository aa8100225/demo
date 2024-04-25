import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { UsersService } from "src/users/users.service"

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<{ username: string; name: string } | null> {
    if (!username || !password || !username.trim() || !password.trim()) {
      throw new HttpException(
        "Username and password must not be empty",
        HttpStatus.BAD_REQUEST
      )
    }
    const user = await this.usersService.findbyUsername(username)
    if (!user || !(await bcrypt.compare(password, user.encrypted_password))) {
      throw new HttpException(
        "Invalid username or password",
        HttpStatus.BAD_REQUEST
      )
    }
    const { encrypted_password, ...result } = user
    return result
  }

  async login(user: { username: string; name: string }) {
    const payload = { username: user.username, name: user.name }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
