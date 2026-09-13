import amqp, { type Channel, type ChannelModel } from "amqplib";
import { config } from "../../config/env.js";

export class RabbitMQConnection {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  async connect(): Promise<void> {
    if (this.connection && this.channel) {
      return;
    }

    const connection = await amqp.connect(config.rabbitmqUrl);
    const channel = await connection.createChannel();

    this.connection = connection;
    this.channel = channel;

    console.log("RabbitMQ connection established");
  }

  getChannel(): Channel {
    if (!this.channel) {
      throw new Error("RabbitMQ connection has not been established");
    }

    return this.channel;
  }

  async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();

    this.channel = null;
    this.connection = null;
  }
}
