import { KafkaConsumer } from "../kafka/KafkaConsumer.js";
import { KafkaProducer } from "../kafka/KafkaProducer.js";
import { KafkaEventBus } from "./KafkaEventBus.js";

const kafkaProducer = new KafkaProducer();
const kafkaConsumer = new KafkaConsumer("flowforge-eventbus");

export const eventBus = new KafkaEventBus(kafkaProducer, kafkaConsumer);
