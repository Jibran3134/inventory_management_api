import { Controller, Post, Body, Get } from "@nestjs/common";
import { OrderService } from "./order.service";
import { LoggerService } from "../../libs/common/logging/logger.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Throttle } from "@nestjs/throttler";
@Controller("orders")
export class OrderController {
  constructor(
    private readonly ordersService: OrderService,
    private readonly logger: LoggerService,
  ) {}
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  create(@Body() dto: CreateOrderDto) {
    try {
      this.logger.log(
        `POST /orders - Creating new order with data: ${JSON.stringify(dto)}`,
      );
      return this.ordersService.createOrder(dto);
    } catch (error) {
      this.logger.error(`Error in POST /orders: ${error.message}`);
      throw error;
    }
  }

  @Get("all")
  getAllOrders() {
    try {
      this.logger.log(`GET /orders/all - Retrieving all orders`);
      return this.ordersService.getAllOrders();
    } catch (error) {
      this.logger.error(`Error in GET /orders/all: ${error.message}`);
      throw error;
    }
  }
}
