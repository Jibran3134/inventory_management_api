import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ProductModule } from "./modules/products/product.module";
import { DatabaseModule } from "./database/database.module";
import { OrderModule } from "./modules/orders/order.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
@Module({
  controllers: [AppController],
  imports: [DatabaseModule, ProductModule, OrderModule, InventoryModule],
})
export class AppModule {}
