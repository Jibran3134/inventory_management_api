import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";

import { AppController } from "./app.controller";

import { ProductModule } from "./modules/products/product.module";
import { OrderModule } from "./modules/orders/order.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { ReportingModule } from "./modules/report/report.module";

/**
 * Infrastructure modules (from libs)
 */
import { DatabaseModule } from "./libs/database/database.module";
import { RedisService } from "./libs/common/cache/redis.service";
import { RateLimitModule } from "./libs/common/rate-limit/throttler.config";
import { LoggerService } from "./libs/common/logging/logger.service";

@Module({
  controllers: [AppController],

  imports: [
    /**
     * Infrastructure
     */
    DatabaseModule,
    RateLimitModule,

    /**
     * Feature Modules
     */
    ProductModule,
    OrderModule,
    InventoryModule,
    ReportingModule,
  ],

  providers: [
    /**
     * Global Rate Limiting Guard
     */
    RedisService,
    LoggerService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
