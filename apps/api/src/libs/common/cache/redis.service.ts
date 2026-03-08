import { Injectable, OnModuleInit } from "@nestjs/common";
import { createClient } from "redis";

@Injectable()
export class RedisService implements OnModuleInit {
  private client;

  async onModuleInit() {
    this.client = createClient({
      url: "redis://localhost:6379",
    });

    await this.client.connect();
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: any, ttl = 60) {
    await this.client.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
