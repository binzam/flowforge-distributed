import { EventEmitter } from "node:events";
import type { EventBus } from "./EventBus.js";
import type { EventMap } from "./EventMap.js";

export class InMemoryEventBus implements EventBus {
  private readonly emitter = new EventEmitter();

  publish<K extends keyof EventMap>(event: EventMap[K]): void {
    this.emitter.emit(event.type, event);
  }

  subscribe<K extends keyof EventMap>(
    eventType: K,
    handler: (event: EventMap[K]) => void | Promise<void>,
  ): void {
    this.emitter.on(eventType, handler);
  }
}
