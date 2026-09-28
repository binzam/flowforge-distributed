import type { Consumer } from "kafkajs";
import { kafka } from "./KafkaClient.js";

export class KafkaConsumer {
  private readonly consumer: Consumer;

  constructor(private readonly groupId: string) {
    this.consumer = kafka.consumer({
      groupId: this.groupId,
    });
  }

  async connect(): Promise<void> {
    await this.consumer.connect();
  }

  async subscribe(topic: string): Promise<void> {
    await this.consumer.subscribe({
      topic,
      fromBeginning: true,
    });
  }

  async run(handler: (message: string) => Promise<void>): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) {
          return;
        }

        await handler(message.value.toString());
      },
    });
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }
}
