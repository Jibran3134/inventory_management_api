// src/modules/inventory/inventory.module.ts
import { Module } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { InventoryController } from "./inventory.controller";
import { PrismaService } from "../../database/prisma.service";
import { DatabaseModule } from "../../database/database.module";
@Module({
  imports: [DatabaseModule],
  controllers: [InventoryController],
  providers: [InventoryService, PrismaService],
  exports: [InventoryService], // So other modules (OrdersModule) can use it
})
export class InventoryModule {}
