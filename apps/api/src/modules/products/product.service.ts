import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";

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
}
