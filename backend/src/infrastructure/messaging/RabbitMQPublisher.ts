import type { Channel } from "amqplib";
import { rabbitMQConnection } from "./rabbitMQConnectionInstance.js";

export class RabbitMQPublisher {
  private readonly channel: Channel;

  constructor() {
    this.channel = rabbitMQConnection.getChannel();
  }

  async publish<T extends object>(
    queueName: string,
    message: T,
  ): Promise<void> {
    await this.channel.assertQueue(queueName, {
      durable: true,
    });

    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
      contentType: "application/json",
    });
  }
}
