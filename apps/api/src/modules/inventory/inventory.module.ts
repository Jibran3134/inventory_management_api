import { Module } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { InventoryController } from "./inventory.controller";
import { PrismaService } from "../../libs/database/prisma.service";
import { DatabaseModule } from "../../libs/database/database.module";
import { LoggerService } from "../../libs/common/logging/logger.service";
@Module({
  imports: [DatabaseModule],
  controllers: [InventoryController],
  providers: [InventoryService, PrismaService, LoggerService],
  exports: [InventoryService],
})
export class InventoryModule {}
