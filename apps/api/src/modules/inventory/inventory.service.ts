// src/modules/inventory/inventory.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async logStockOut(productId: number, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException("Product not found");

    return this.prisma.inventoryOperation.create({
      data: {
        productId,
        quantity: -Math.abs(quantity), // ensure it's negative
        type: "Order",
      },
    });
  }

  async logStockIn(productId: number, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException("Product not found");
    await this.prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: {
          increment: quantity,
        },
      },
    });
    return this.prisma.inventoryOperation.create({
      data: {
        productId,
        quantity: Math.abs(quantity), // ensure it's positive
        type: "Restock",
      },
    });
  }
  async getInventoryLog(productId: number) {
    return this.prisma.inventoryOperation.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });
  }
  async getLog() {
    return this.prisma.inventoryOperation.findMany({});
  }
}
