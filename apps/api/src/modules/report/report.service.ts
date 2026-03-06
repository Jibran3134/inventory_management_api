// src/modules/reporting/reporting.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class ReportingService {
  constructor(private prisma: PrismaService) {}

  async getLowStockProducts(threshold: number = 5) {
    return this.prisma.product.findMany({
      where: { stockQuantity: { lte: threshold }, isActive: true },
      orderBy: { stockQuantity: "asc" },
    });
  }

  async getSalesReport(startDate: Date, endDate: Date) {
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

    return {
      totalOrders,
      totalRevenue,
    };
  }
}
