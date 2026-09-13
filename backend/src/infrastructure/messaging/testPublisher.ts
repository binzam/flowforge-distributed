import { rabbitMQConnection } from "./rabbitMQConnectionInstance.js";
import { RabbitMQPublisher } from "./RabbitMQPublisher.js";

await rabbitMQConnection.connect();

const publisher = new RabbitMQPublisher();

await publisher.publish("send-order-email", {
  orderId: "test-order-123",
  email: "customer@example.com",
  subject: "Your order has been confirmed",
});

console.log("Message published");

await rabbitMQConnection.close();