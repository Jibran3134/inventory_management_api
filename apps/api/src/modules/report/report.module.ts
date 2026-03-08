// src/modules/reporting/reporting.module.ts
import { Module } from "@nestjs/common";
import { ReportingService } from "./report.service";
import { ReportingController } from "./report.controller";
import { PrismaService } from "../../libs/database/prisma.service";
import { LoggerService } from "../../libs/common/logging/logger.service";
import { DatabaseModule } from "../../libs/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [ReportingController],
  providers: [ReportingService, PrismaService, LoggerService],
  exports: [ReportingService],
})
export class ReportingModule {}
