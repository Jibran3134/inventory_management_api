import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../libs/database/prisma.service";
import { LoggerService } from "../../libs/common/logging/logger.service";
import { RedisService } from "../../libs/common/cache/redis.service";

@Injectable()
export class ReportingService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly redisService: RedisService,
  ) {}

  private LOW_STOCK_CACHE_KEY = "low-stock";
  private SALES_CACHE_KEY_PREFIX = "sales-report:";

  /** Low stock report with Redis caching */
  async getLowStockProducts(threshold: number = 5) {
    const cacheKey = `${this.LOW_STOCK_CACHE_KEY}:${threshold}`;
    try {
      // Try to get cached value
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        this.logger.log(
          `Returning cached low stock report for threshold: ${threshold}`,
        );
        return JSON.parse(cached);
      }

      this.logger.log(
        `Generating low stock products report with threshold: ${threshold}`,
      );
      const products = await this.prisma.product.findMany({
        where: { stockQuantity: { lte: threshold }, isActive: true },
        orderBy: { stockQuantity: "asc" },
      });

      this.logger.log(`Found ${products.length} products with low stock`);

      // Cache in Redis
      await this.redisService.set(cacheKey, products, 60); // TTL 60s

      return products;
    } catch (error) {
      this.logger.error(`Error generating low stock report: ${error.message}`);
      throw error;
    }
  }

  /** Sales report with Redis caching */
  async getSalesReport(startDate: Date, endDate: Date) {
    const cacheKey = `${this.SALES_CACHE_KEY_PREFIX}${startDate.toISOString()}:${endDate.toISOString()}`;
    try {
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        this.logger.log(
          `Returning cached sales report for period: ${startDate} to ${endDate}`,
        );
        return JSON.parse(cached);
      }

      this.logger.log(
        `Generating sales report for period: ${startDate} to ${endDate}`,
      );
      const orders = await this.prisma.order.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        include: { product: true },
      });

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalPrice,
        0,
      );
      const result = { totalOrders, totalRevenue };

      this.logger.log(
        `Sales report generated. Total Orders: ${totalOrders}, Total Revenue: ${totalRevenue}`,
      );

      await this.redisService.set(cacheKey, result, 60); // TTL 60s

      return result;
    } catch (error) {
      this.logger.error(`Error generating sales report: ${error.message}`);
      throw error;
    }
  }
}
