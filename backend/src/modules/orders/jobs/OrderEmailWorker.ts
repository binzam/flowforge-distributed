import { RabbitMQWorker } from "../../../infrastructure/messaging/RabbitMQWorker.js";
import { EmailService } from "../../../infrastructure/email/EmailService.js";
import {
  sendOrderEmailJobSchema,
  type SendOrderEmailJob,
} from "../../../infrastructure/messaging/jobs/sendOrderEmailJob.js";

const SEND_ORDER_EMAIL_QUEUE = "send-order-email";

export class OrderEmailWorker {
  constructor(
    private readonly rabbitMQWorker: RabbitMQWorker,
    private readonly emailService: EmailService,
  ) {}

  async start(): Promise<void> {
    await this.rabbitMQWorker.consume(
      SEND_ORDER_EMAIL_QUEUE,
      async (message) => {
        const job: SendOrderEmailJob = sendOrderEmailJobSchema.parse(message);

        await this.emailService.send({
          to: job.email,
          subject: "Your FlowForge order has been confirmed",
          html: `
            <h1>Order Confirmed</h1>
            <p>Hello ${job.customerName},</p>
            <p>Your order has been successfully confirmed.</p>
            <p>Order ID: ${job.orderId}</p>
            <p>Thank you for shopping with FlowForge.</p>
          `,
        });

        console.log(
          `Order confirmation email sent for order ${job.orderId} user ${job.customerName}`,
        );
      },
    );
  }
}
