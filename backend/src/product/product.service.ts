import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Product } from "./product.entity"
import { ProductDto } from "./dto/product.dto"

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      order: {
        id: "DESC",
      },
    })
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } })
    if (!product) {
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND)
    }
    return product
  }

  async create(productDto: ProductDto): Promise<Product> {
    this.productValueValidation(productDto)
    const product = this.productRepository.create(productDto)
    await this.productRepository.save(product)
    return product
  }

  async update(id: number, productDto: ProductDto): Promise<Product> {
    const product = await this.findOne(id)
    if (!product) {
      throw new HttpException(
        "Product not found, please refresh the page.",
        HttpStatus.NOT_FOUND
      )
    }
    this.productValueValidation(productDto)
    Object.assign(product, productDto)
    await this.productRepository.save(product)
    return product
  }

  async delete(id: number): Promise<void> {
    const result = await this.productRepository.delete(id)
    if (result.affected === 0) {
      throw new HttpException(
        "Product not found, please refresh the page.",
        HttpStatus.NOT_FOUND
      )
    }
  }

  productValueValidation(product: Product | ProductDto) {
    if (
      !product.name ||
      product.price === undefined ||
      product.quantity === undefined
    ) {
      throw new HttpException(
        "All fields are required.",
        HttpStatus.BAD_REQUEST
      )
    }
    if (!product.name.match(/^[a-zA-Z0-9]+$/) || product.name.length > 100) {
      throw new HttpException(
        "Name must contain only alphanumeric characters and be 1-100 characters long.",
        HttpStatus.BAD_REQUEST
      )
    }
    const maxPrice = 99999999.99 // decimal(10,2)
    if (isNaN(product.price)) {
      throw new HttpException("Price must be a number.", HttpStatus.BAD_REQUEST)
    }
    if (product.price <= 0) {
      throw new HttpException(
        "Price must be greater than zero.",
        HttpStatus.BAD_REQUEST
      )
    }
    if (!/^(\d+(\.\d{0,2})?|\.?\d{1,2})$/.test(product.price.toString())) {
      throw new HttpException(
        "Price must not have more than two decimal places.",
        HttpStatus.BAD_REQUEST
      )
    }
    if (product.price > maxPrice) {
      throw new HttpException(
        `Price must not exceed ${maxPrice}.`,
        HttpStatus.BAD_REQUEST
      )
    }

    if (
      isNaN(product.quantity) ||
      !Number.isInteger(Number(product.quantity))
    ) {
      throw new HttpException(
        "Quantity must be an integer.",
        HttpStatus.BAD_REQUEST
      )
    }
    if (product.quantity <= 0) {
      throw new HttpException(
        "Quantity must be a positive integer.",
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
