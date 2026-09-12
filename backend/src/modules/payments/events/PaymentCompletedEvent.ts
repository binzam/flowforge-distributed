import type { DomainEvent } from "../../../infrastructure/events/Event.js";

interface PaymentCompletedPayload {
  paymentId: string;
  orderId: string;
  amount: string;
  txRef: string;
}

export class PaymentCompletedEvent implements DomainEvent {
  readonly type = "payment.completed";
  readonly occurredAt = new Date();

  constructor(readonly payload: PaymentCompletedPayload) {}
}
