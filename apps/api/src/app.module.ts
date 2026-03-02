import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ProductModule } from "./modules/products/product.module";
@Module({
  controllers: [AppController],
  imports: [ProductModule],
})
export class AppModule {}
