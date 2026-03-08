// src/modules/inventory/inventory.controller.ts
import { Controller, Post, Param, Body, Get } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { LoggerService } from "../../libs/common/logging/logger.service";
import { Throttle } from "@nestjs/throttler";
@Controller("inventory")
export class InventoryController {
  constructor(
    private inventoryService: InventoryService,
    private readonly logger: LoggerService,
  ) {}
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("restock/:productId")
  async restock(
    @Param("productId") productId: string,
    @Body("quantity") quantity: number,
  ) {
    try {
      this.logger.log(
        `POST /inventory/restock/${productId} - Restocking product with quantity: ${quantity}`,
      );
      return this.inventoryService.logStockIn(+productId, quantity);
    } catch (error) {
      this.logger.error(
        `Error in POST /inventory/restock/${productId}: ${error.message}`,
      );
      throw error;
    }
  }
  @Get("log/:productId")
  async log(@Param("productId") productId: string) {
    try {
      this.logger.log(
        `GET /inventory/log/${productId} - Retrieving inventory log for product`,
      );
      return this.inventoryService.getInventoryLog(+productId);
    } catch (error) {
      this.logger.error(
        `Error in GET /inventory/log/${productId}: ${error.message}`,
      );
      throw error;
    }
  }
  @Get("log")
  async getLog() {
    try {
      this.logger.log(`GET /inventory/log - Retrieving all inventory logs`);
      return this.inventoryService.getLog();
    } catch (error) {
      this.logger.error(`Error in GET /inventory/log: ${error.message}`);
      throw error;
    }
  }
}
