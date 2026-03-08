// src/modules/reporting/reporting.controller.ts
import { Controller, Get, Query } from "@nestjs/common";
import { ReportingService } from "./report.service";
import { LoggerService } from "../../libs/common/logging/logger.service";
import { Throttle } from "@nestjs/throttler";
@Controller("reporting")
export class ReportingController {
  constructor(
    private reportingService: ReportingService,
    private readonly logger: LoggerService,
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60 } })
  @Get("low-stock")
  async lowStock() {
    try {
      this.logger.log(`GET /reporting/low-stock - Generating low stock report`);
      return this.reportingService.getLowStockProducts();
    } catch (error) {
      this.logger.error(`Error in GET /reporting/low-stock: ${error.message}`);
      throw error;
    }
  }

  @Get("sales")
  async sales(@Query("start") start: string, @Query("end") end: string) {
    try {
      this.logger.log(
        `GET /reporting/sales - Generating sales report for period ${start} to ${end}`,
      );
      const startDate = new Date(start);
      const endDate = new Date(end);
      return this.reportingService.getSalesReport(startDate, endDate);
    } catch (error) {
      this.logger.error(`Error in GET /reporting/sales: ${error.message}`);
      throw error;
    }
  }
}
