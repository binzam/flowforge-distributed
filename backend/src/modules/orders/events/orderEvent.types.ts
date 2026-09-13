export interface OrderEvent {
  id: string;
  orderId: string;
  eventType: string;
  payload: Record<string, unknown>;
  occurredAt: Date;
}