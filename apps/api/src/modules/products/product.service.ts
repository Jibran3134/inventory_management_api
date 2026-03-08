import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../libs/database/prisma.service";
import { LoggerService } from "../../libs/common/logging/logger.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { throwError } from "rxjs";

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  create(productDto: CreateProductDto) {
    try {
      this.logger.log(`Creating product: ${productDto.name}`);
      return this.prisma.product.create({
        data: productDto,
      });
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`);
      throw error;
    }
  }

  getAllProducts() {
    try {
      this.logger.log(`Fetching all products`);
      return this.prisma.product.findMany();
    } catch (error) {
      this.logger.error(`Error fetching all products: ${error.message}`);
      throw error;
    }
  }

  async getProductById(id: number) {
    try {
      this.logger.log(`Fetching product with id: ${id}`);
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        this.logger.warn(`Product with id ${id} not found`);
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      return product;
    } catch (error) {
      this.logger.error(`Error fetching product ${id}: ${error.message}`);
      throw error;
    }
  }

  async updateProduct(id: number, productDto: UpdateProductDto) {
    try {
      this.logger.log(`Updating product with id: ${id}`);
      await this.getProductById(id);
      const updated = await this.prisma.product.update({
        where: { id },
        data: productDto,
      });
      this.logger.log(`Product ${id} updated successfully`);
      return updated;
    } catch (error) {
      this.logger.error(`Error updating product ${id}: ${error.message}`);
      throw error;
    }
  }

  async deleteProduct(id: number) {
    try {
      this.logger.log(`Deleting product with id: ${id}`);
      await this.getProductById(id);
      const deleted = await this.prisma.product.delete({
        where: { id },
      });
      this.logger.log(`Product ${id} deleted successfully`);
      return deleted;
    } catch (error) {
      this.logger.error(`Error deleting product ${id}: ${error.message}`);
      throw error;
    }
  }

  async getHighStockProducts() {
    try {
      this.logger.log(`Fetching high stock products (descending order)`);
      return await this.prisma.product.findMany({
        orderBy: {
          stockQuantity: "desc",
        },
      });
    } catch (error) {
      this.logger.error(`Error fetching high stock products: ${error.message}`);
      throw error;
    }
  }

  async getLowStockProducts() {
    try {
      this.logger.log(`Fetching low stock products (ascending order)`);
      return await this.prisma.product.findMany({
        orderBy: {
          stockQuantity: "asc",
        },
      });
    } catch (error) {
      this.logger.error(`Error fetching low stock products: ${error.message}`);
      throw error;
    }
  }

  async getStockById(id: number) {
    try {
      this.logger.log(`Fetching stock for product ${id}`);
      const product = await this.getProductById(id);
      return { stock: product.stockQuantity };
    } catch (error) {
      this.logger.error(
        `Error fetching stock for product ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async increaseQuantity(productID: number, quantity: number) {
    try {
      this.logger.log(
        `Increasing quantity for product ${productID} by ${quantity}`,
      );
      const result = await this.prisma.product.updateMany({
        where: { id: productID },
        data: {
          stockQuantity: {
            increment: quantity,
          },
        },
      });
      this.logger.log(`Quantity increased for product ${productID}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error increasing quantity for product ${productID}: ${error.message}`,
      );
      throw error;
    }
  }
}
