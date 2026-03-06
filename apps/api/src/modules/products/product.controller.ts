import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Put,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { identity } from "rxjs";

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
  @Get("ascending")
  displayAscendingQuantity() {
    return this.productService.getLowStockProducts();
  }

  @Get("descending")
  displayDescendingQuantity() {
    return this.productService.getHighStockProducts();
  }
  @Get(":id")
  getProductById(@Param("id", ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }

  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productService.updateProduct(id, dto);
  }

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }

  @Get(":id/stock")
  getStockById(@Param("id", ParseIntPipe) id: number) {
    return this.productService.getStockById(id);
  }
}
