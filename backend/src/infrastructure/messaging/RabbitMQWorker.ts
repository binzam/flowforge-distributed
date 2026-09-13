import type { Channel } from "amqplib";
import { rabbitMQConnection } from "./rabbitMQConnectionInstance.js";

export class RabbitMQWorker {
  private readonly channel: Channel;

  constructor() {
    this.channel = rabbitMQConnection.getChannel();
  }

  async consume(
    queueName: string,
    handler: (message: Record<string, unknown>) => Promise<void>,
  ): Promise<void> {
    await this.channel.assertQueue(queueName, {
      durable: true,
    });

    await this.channel.prefetch(1);

    await this.channel.consume(queueName, async (message) => {
      if (!message) {
        return;
      }

      try {
        const payload = JSON.parse(message.content.toString()) as Record<
          string,
          unknown
        >;

        await handler(payload);

        this.channel.ack(message);
      } catch (error) {
        console.error(`Failed to process message from ${queueName}`, error);

        this.channel.nack(message, false, true);
      }
    });

    console.log(`RabbitMQ worker listening on ${queueName}`);
  }
}
