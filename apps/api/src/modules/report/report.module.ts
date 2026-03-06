// src/modules/reporting/reporting.module.ts
import { Module } from "@nestjs/common";
import { ReportingService } from "./report.service";
import { ReportingController } from "./report.controller";
import { PrismaService } from "../../database/prisma.service";

@Module({
  controllers: [ReportingController],
  providers: [ReportingService, PrismaService],
  exports: [ReportingService],
})
export class ReportingModule {}
