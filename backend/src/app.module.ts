import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { UsersModule } from "./users/users.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./users/user.entity"
import { AuthModule } from "./auth/auth.module"
import { ProtectedResourceModule } from "./protected_resource/protected_resource.module"
import { ProductModule } from "./product/product.module"
import { Product } from "./product/product.entity"
import * as dotenv from "dotenv"
dotenv.config()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Product],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ProtectedResourceModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
