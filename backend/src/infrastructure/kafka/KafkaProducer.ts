import type { Producer } from "kafkajs";
import { kafka } from "./KafkaClient.js";

export class KafkaProducer {
  private readonly producer: Producer;

  constructor() {
    this.producer = kafka.producer();
  }

  async connect(): Promise<void> {
    await this.producer.connect();
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  async publish(topic: string, message: unknown): Promise<void> {
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  }
}
