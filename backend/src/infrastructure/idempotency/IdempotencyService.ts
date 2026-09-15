import { redisClient } from "../redis/redisClient.js";

interface IdempotencyResult {
  status: "processing" | "completed";
  response?: {
    statusCode: number;
    body: unknown;
  };
}

export class IdempotencyService {
  private readonly ttlSeconds = 60 * 60;

  private getKey(key: string): string {
    return `idempotency:${key}`;
  }

  async acquire(key: string): Promise<boolean> {
    const result = await redisClient.set(
      this.getKey(key),
      JSON.stringify({
        status: "processing",
      }),
      {
        condition: "NX",
        expiration: { type: "EX", value: this.ttlSeconds },
      },
    );

    return result === "OK";
  }

  async get(key: string): Promise<IdempotencyResult | null> {
    const value = await redisClient.get(this.getKey(key));

    if (!value) {
      return null;
    }

    return JSON.parse(value) as IdempotencyResult;
  }

  async complete(
    key: string,
    statusCode: number,
    body: unknown,
  ): Promise<void> {
    await redisClient.set(
      this.getKey(key),
      JSON.stringify({
        status: "completed",
        response: {
          statusCode,
          body,
        },
      }),
      {
        EX: this.ttlSeconds,
      },
    );
  }

  async release(key: string): Promise<void> {
    await redisClient.del(this.getKey(key));
  }
}
