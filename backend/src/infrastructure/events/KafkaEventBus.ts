import type { EventBus } from "./EventBus.js";
import type { EventMap } from "./EventMap.js";
import { KafkaProducer } from "../kafka/KafkaProducer.js";
import { KafkaConsumer } from "../kafka/KafkaConsumer.js";

type EventHandler = (event: unknown) => void | Promise<void>;

export class KafkaEventBus implements EventBus {
  private readonly handlers = new Map<keyof EventMap, Set<EventHandler>>();

  constructor(
    private readonly producer: KafkaProducer,
    private readonly consumer: KafkaConsumer,
  ) {}

  async publish<K extends keyof EventMap>(event: EventMap[K]): Promise<void> {
    await this.producer.publish("flowforge.events", {
      type: event.type,
      occurredAt: event.occurredAt.toISOString(),
      payload: event.payload,
    });
  }

  subscribe<K extends keyof EventMap>(
    eventType: K,
    handler: (event: EventMap[K]) => void | Promise<void>,
  ): void {
    const handlers = this.handlers.get(eventType) ?? new Set<EventHandler>();

    handlers.add(handler as EventHandler);

    this.handlers.set(eventType, handlers);
  }

  async start(): Promise<void> {
    await this.consumer.connect();

    await this.consumer.subscribe("flowforge.events");

    void this.consumer.run(async (message) => {
      await this.handleMessage(message);
    });
  }

  private async handleMessage(message: string): Promise<void> {
    const parsed = JSON.parse(message) as {
      type: keyof EventMap;
      occurredAt: string;
      payload: unknown;
    };

    const handlers = this.handlers.get(parsed.type);

    if (!handlers) {
      return;
    }

    const event = {
      type: parsed.type,
      occurredAt: new Date(parsed.occurredAt),
      payload: parsed.payload,
    };

    for (const handler of handlers) {
      await handler(event);
    }
  }
}
