import type { EventMap } from "./EventMap.js";

export interface EventBus {
  publish<K extends keyof EventMap>(event: EventMap[K]): void;

  subscribe<K extends keyof EventMap>(
    eventType: K,
    handler: (event: EventMap[K]) => void | Promise<void>,
  ): void;
}
