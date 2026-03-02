import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "../../../prisma/prisma.service";
@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // We will add methods here later
}
