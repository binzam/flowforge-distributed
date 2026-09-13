import { rabbitMQConnection } from "../infrastructure/messaging/rabbitMQConnectionInstance.js";
import { RabbitMQWorker } from "../infrastructure/messaging/RabbitMQWorker.js";
import { NodemailerEmailProvider } from "../infrastructure/email/NodemailerEmailProvider.js";
import { EmailService } from "../infrastructure/email/EmailService.js";
import { OrderEmailWorker } from "../modules/orders/jobs/OrderEmailWorker.js";

await rabbitMQConnection.connect();

const rabbitMQWorker = new RabbitMQWorker();

const emailProvider = new NodemailerEmailProvider();
const emailService = new EmailService(emailProvider);

const orderEmailWorker = new OrderEmailWorker(rabbitMQWorker, emailService);

await orderEmailWorker.start();
