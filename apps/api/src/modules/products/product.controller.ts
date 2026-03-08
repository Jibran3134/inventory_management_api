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
import { LoggerService } from "../../libs/common/logging/logger.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Throttle } from "@nestjs/throttler";

@Controller("products")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly logger: LoggerService,
  ) {}
  @Throttle({ default: { limit: 5, ttl: 60 } }) // Limit to 5 requests per minute
  @Post()
  create(@Body() productDto: CreateProductDto) {
    try {
      this.logger.log(
        `POST /products - Creating new product: ${productDto.name}`,
      );
      return this.productService.create(productDto);
    } catch (error) {
      this.logger.error(`Error in POST /products: ${error.message}`);
      throw error;
    }
  }
  @Get("all")
  displayAll() {
    try {
      this.logger.log(`GET /products/all - Retrieving all products`);
      return this.productService.getAllProducts();
    } catch (error) {
      this.logger.error(`Error in GET /products/all: ${error.message}`);
      throw error;
    }
  }
  @Get("ascending")
  displayAscendingQuantity() {
    try {
      this.logger.log(
        `GET /products/ascending - Retrieving low stock products`,
      );
      return this.productService.getLowStockProducts();
    } catch (error) {
      this.logger.error(`Error in GET /products/ascending: ${error.message}`);
      throw error;
    }
  }

  @Get("descending")
  displayDescendingQuantity() {
    try {
      this.logger.log(
        `GET /products/descending - Retrieving high stock products`,
      );
      return this.productService.getHighStockProducts();
    } catch (error) {
      this.logger.error(`Error in GET /products/descending: ${error.message}`);
      throw error;
    }
  }
  @Get(":id")
  getProductById(@Param("id", ParseIntPipe) id: number) {
    try {
      this.logger.log(`GET /products/${id} - Retrieving product`);
      return this.productService.getProductById(id);
    } catch (error) {
      this.logger.error(`Error in GET /products/${id}: ${error.message}`);
      throw error;
    }
  }

  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    try {
      this.logger.log(
        `PUT /products/${id} - Updating product with data: ${JSON.stringify(dto)}`,
      );
      return this.productService.updateProduct(id, dto);
    } catch (error) {
      this.logger.error(`Error in PUT /products/${id}: ${error.message}`);
      throw error;
    }
  }

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    try {
      this.logger.log(`DELETE /products/${id} - Deleting product`);
      return this.productService.deleteProduct(id);
    } catch (error) {
      this.logger.error(`Error in DELETE /products/${id}: ${error.message}`);
      throw error;
    }
  }

  @Get(":id/stock")
  getStockById(@Param("id", ParseIntPipe) id: number) {
    try {
      this.logger.log(
        `GET /products/${id}/stock - Retrieving stock for product`,
      );
      return this.productService.getStockById(id);
    } catch (error) {
      this.logger.error(`Error in GET /products/${id}/stock: ${error.message}`);
      throw error;
    }
  }
}
