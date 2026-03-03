import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { throwError } from "rxjs";

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  create(productDto: CreateProductDto) {
    return this.prisma.product.create({
      data: productDto,
    });
  }

  getAllProducts() {
    return this.prisma.product.findMany();
  }

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async updateProduct(id: number, productDto: UpdateProductDto) {
    await this.getProductById(id);
    return this.prisma.product.update({
      where: { id },
      data: productDto,
    });
  }

  async deleteProduct(id: number) {
    await this.getProductById(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async getHighStockProducts() {
    return await this.prisma.product.findMany({
      orderBy: {
        stockQuantity: "desc",
      },
    });
  }

  async getLowStockProducts() {
    return await this.prisma.product.findMany({
      orderBy: {
        stockQuantity: "asc",
      },
    });
  }
}
