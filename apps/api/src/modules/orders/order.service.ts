import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../libs/database/prisma.service";
import { LoggerService } from "../../libs/common/logging/logger.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ProductService } from "../products/product.service";
import { InventoryService } from "../inventory/inventory.service";
@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
    private readonly inventoryService: InventoryService,
    private readonly logger: LoggerService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      const { productId, quantity } = createOrderDto;
      this.logger.log(
        `Creating order for product ID: ${productId}, quantity: ${quantity}`,
      );

      const product = await this.productService.getProductById(productId);

      if (!product) {
        this.logger.error(`Product with id ${productId} not found`);
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      if (product.stockQuantity < quantity) {
        this.logger.warn(
          `Insufficient stock for product ${productId}. Available: ${product.stockQuantity}, Requested: ${quantity}`,
        );
        throw new NotFoundException(
          `Not enough stock for product with id ${productId}`,
        );
      }
      this.inventoryService.logStockOut(productId, quantity);
      await this.prisma.product.update({
        where: { id: productId },
        data: {
          stockQuantity: product.stockQuantity - quantity,
        },
      });

      const totalPrice = product.price * quantity;

      const order = await this.prisma.order.create({
        data: {
          productId,
          quantity,
          totalPrice,
        },
      });

      this.logger.log(
        `Order created successfully. Order ID: ${order.id}, Total Price: ${totalPrice}`,
      );
      return order;
    } catch (error) {
      this.logger.error(`Error creating order: ${error.message}`);
      throw error;
    }
  }
  async getAllOrders() {
    try {
      this.logger.log(`Fetching all orders`);
      const orders = await this.prisma.order.findMany();
      this.logger.log(`Retrieved ${orders.length} orders`);
      return orders;
    } catch (error) {
      this.logger.error(`Error retrieving orders: ${error.message}`);
      throw error;
    }
  }
}
