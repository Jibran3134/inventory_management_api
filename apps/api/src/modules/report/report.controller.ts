// src/modules/reporting/reporting.controller.ts
import { Controller, Get, Query } from "@nestjs/common";
import { ReportingService } from "./report.service";

@Controller("reporting")
export class ReportingController {
  constructor(private reportingService: ReportingService) {}

 
  @Get("low-stock")
  async lowStock() {
    return this.reportingService.getLowStockProducts();
  }

  @Get("sales")
  async sales(@Query("start") start: string, @Query("end") end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.reportingService.getSalesReport(startDate, endDate);
  }
}
