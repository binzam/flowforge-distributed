import { rabbitMQConnection } from "./rabbitMQConnectionInstance.js";
import { RabbitMQWorker } from "./RabbitMQWorker.js";

await rabbitMQConnection.connect();

const worker = new RabbitMQWorker();

await worker.consume("send-order-email", async (message) => {
  console.log("Received RabbitMQ message:");
  console.log(message);
});