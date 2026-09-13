import { RabbitMQPublisher } from "../../../infrastructure/messaging/RabbitMQPublisher.js";
import type { SendOrderEmailJob } from "../../../infrastructure/messaging/jobs/sendOrderEmailJob.js";

const SEND_ORDER_EMAIL_QUEUE = "send-order-email";

export class OrderEmailPublisher {
  constructor(private readonly rabbitMQPublisher: RabbitMQPublisher) {}

  async publish(job: SendOrderEmailJob): Promise<void> {
    await this.rabbitMQPublisher.publish(SEND_ORDER_EMAIL_QUEUE, job);
  }
}
