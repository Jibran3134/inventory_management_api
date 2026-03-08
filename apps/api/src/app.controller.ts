import { Controller, Get } from "@nestjs/common";
import { LoggerService } from "./libs/common/logging/logger.service";

@Controller()
export class AppController {
  constructor(private readonly logger: LoggerService) {}
  @Get()
  getHello(): string {
    this.logger.log(`GET / - Health check request`);
    return "NestJS Monorepo Running";
  }
}
