import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseFilters,
  HttpException,
  HttpStatus,
} from "@nestjs/common"
import { ProductService } from "./product.service"
import { Product } from "./product.entity"
import { ProductDto } from "./dto/product.dto"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { HttpErrorFilter } from "src/common/http-error.filter"
import { CommonResponse } from "src/common/types/response.types"

@Controller("/api/products")
@UseFilters(HttpErrorFilter)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<CommonResponse<Product[]>> {
    return {
      message: "Products retrieved successfully",
      data: await this.productService.findAll(),
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: number): Promise<CommonResponse<Product>> {
    try {
      const product = await this.productService.findOne(id)
      return {
        message: "Get Product Successfully",
        data: product,
      }
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

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() productDto: ProductDto
  ): Promise<CommonResponse<Product>> {
    try {
      const createdProduct = await this.productService.create(productDto)
      return {
        message: "Product created successfully.",
        data: createdProduct,
      }
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

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() productDto: ProductDto
  ): Promise<CommonResponse<Product>> {
    try {
      const updatedProduct = await this.productService.update(id, productDto)
      return {
        message: "Product updated successfully.",
        data: updatedProduct,
      }
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

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: number): Promise<CommonResponse<boolean>> {
    try {
      await this.productService.delete(id)
      return { message: "Product deleted successfully", data: true }
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
