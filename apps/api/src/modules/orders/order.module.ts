import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { ProductModule } from "../products/product.module";
import { InventoryModule } from "../inventory/inventory.module";
@Module({
  imports: [DatabaseModule, ProductModule, InventoryModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
