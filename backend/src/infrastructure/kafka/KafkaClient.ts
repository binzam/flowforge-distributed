import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "flowforge-api",
  brokers: ["localhost:9092"],
});
