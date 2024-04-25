import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor() {
    super()
  }

  canActivate(context: ExecutionContext): boolean {
    // others validation such as role auth etc.
    return super.canActivate(context) as boolean
  }

  handleRequest(err, user, info, context: ExecutionContext, status) {
    if (err || !user) {
      throw new HttpException(
        "Unauthorized access , token expired please login again",
        HttpStatus.UNAUTHORIZED
      )
    }
    return user
  }
}
