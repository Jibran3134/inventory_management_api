// src/modules/reporting/reporting.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../libs/database/prisma.service";
import { LoggerService } from "../../libs/common/logging/logger.service";

@Injectable()
export class ReportingService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async getLowStockProducts(threshold: number = 5) {
    try {
      this.logger.log(
        `Generating low stock products report with threshold: ${threshold}`,
      );
      const products = await this.prisma.product.findMany({
        where: { stockQuantity: { lte: threshold }, isActive: true },
        orderBy: { stockQuantity: "asc" },
      });
      this.logger.log(`Found ${products.length} products with low stock`);
      return products;
    } catch (error) {
      this.logger.error(`Error generating low stock report: ${error.message}`);
      throw error;
    }
  }

  async getSalesReport(startDate: Date, endDate: Date) {
    try {
      this.logger.log(
        `Generating sales report for period: ${startDate} to ${endDate}`,
      );
      const orders = await this.prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: { product: true },
      });
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalPrice,
        0,
      );

      this.logger.log(
        `Sales report generated. Total Orders: ${totalOrders}, Total Revenue: ${totalRevenue}`,
      );
      return {
        totalOrders,
        totalRevenue,
      };
    } catch (error) {
      this.logger.error(`Error generating sales report: ${error.message}`);
      throw error;
    }
  }
}
