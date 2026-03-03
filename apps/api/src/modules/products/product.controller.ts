import { Controller, Post, Body, Get } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() productDto: CreateProductDto) {
    return this.productService.create(productDto);
  }
  @Get("all")
  displayAll() {
    return this.productService.getAllProducts();
  }
}
