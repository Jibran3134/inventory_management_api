// src/modules/inventory/inventory.controller.ts
import { Controller, Post, Param, Body, Get } from "@nestjs/common";
import { InventoryService } from "./inventory.service";

@Controller("inventory")
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post("restock/:productId")
  async restock(
    @Param("productId") productId: string,
    @Body("quantity") quantity: number,
  ) {
    return this.inventoryService.logStockIn(+productId, quantity);
  }
  @Get("log/:productId")
  async log(@Param("productId") productId: string) {
    return this.inventoryService.getInventoryLog(+productId);
  }
  @Get("log")
  async getLog() {
    return this.inventoryService.getLog();
  }
}
