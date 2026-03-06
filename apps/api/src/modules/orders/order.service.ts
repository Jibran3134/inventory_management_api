import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ProductService } from "../products/product.service";
import { InventoryService } from "../inventory/inventory.service";
@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
    private readonly inventoryService: InventoryService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { productId, quantity } = createOrderDto;

    const product = await this.productService.getProductById(productId);

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    if (product.stockQuantity < quantity) {
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

    return order;
  }
  async getAllOrders() {
    return await this.prisma.order.findMany();
  }
}
