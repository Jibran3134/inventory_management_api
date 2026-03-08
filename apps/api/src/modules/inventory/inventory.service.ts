import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../libs/database/prisma.service";
import { LoggerService } from "../../libs/common/logging/logger.service";
@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async logStockOut(productId: number, quantity: number) {
    try {
      this.logger.log(
        `Logging stock out for product ${productId}, quantity: ${quantity}`,
      );
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        this.logger.error(
          `Product ${productId} not found for stock out operation`,
        );
        throw new NotFoundException("Product not found");
      }

      const result = await this.prisma.inventoryOperation.create({
        data: {
          productId,
          quantity: -Math.abs(quantity), // ensure it's negative
          type: "Order",
        },
      });
      this.logger.log(`Stock out logged successfully for product ${productId}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error logging stock out for product ${productId}: ${error.message}`,
      );
      throw error;
    }
  }

  async logStockIn(productId: number, quantity: number) {
    try {
      this.logger.log(
        `Logging stock in for product ${productId}, quantity: ${quantity}`,
      );
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        this.logger.error(
          `Product ${productId} not found for stock in operation`,
        );
        throw new NotFoundException("Product not found");
      }
      await this.prisma.product.update({
        where: { id: productId },
        data: {
          stockQuantity: {
            increment: quantity,
          },
        },
      });
      const result = await this.prisma.inventoryOperation.create({
        data: {
          productId,
          quantity: Math.abs(quantity), // ensure it's positive
          type: "Restock",
        },
      });
      this.logger.log(`Stock in logged successfully for product ${productId}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error logging stock in for product ${productId}: ${error.message}`,
      );
      throw error;
    }
  }
  async getInventoryLog(productId: number) {
    try {
      this.logger.log(`Fetching inventory log for product ${productId}`);
      const logs = await this.prisma.inventoryOperation.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
      });
      this.logger.log(
        `Retrieved ${logs.length} inventory logs for product ${productId}`,
      );
      return logs;
    } catch (error) {
      this.logger.error(
        `Error fetching inventory log for product ${productId}: ${error.message}`,
      );
      throw error;
    }
  }
  async getLog() {
    try {
      this.logger.log(`Fetching complete inventory logs`);
      const logs = await this.prisma.inventoryOperation.findMany({});
      this.logger.log(`Retrieved ${logs.length} total inventory logs`);
      return logs;
    } catch (error) {
      this.logger.error(`Error fetching inventory logs: ${error.message}`);
      throw error;
    }
  }
}
