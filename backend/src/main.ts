import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { HttpErrorFilter } from "./common/http-error.filter"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
const cors = require("cors")
async function bootstrap() {
  const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.use(helmet())
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  )
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 100,
    })
  )
  app.useGlobalFilters(new HttpErrorFilter())
  await app.listen(3000)
}
bootstrap()
