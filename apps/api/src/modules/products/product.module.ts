import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { DatabaseModule } from "../../libs/database/database.module";
import { LoggerService } from "../../libs/common/logging/logger.service";

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [ProductService, LoggerService],
  exports: [ProductService],
})
export class ProductModule {}
