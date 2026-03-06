import { Controller, Post, Body, Get } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@Controller("orders")
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get("all")
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }
}
