import type { FulfillmentDeliveredEvent } from "../../modules/fulfillments/events/FulfillmentDeliveredEvent.js";
import type { FulfillmentShippedEvent } from "../../modules/fulfillments/events/FulfillmentShippedEvent.js";
import type { InventoryReleasedEvent } from "../../modules/inventory/events/InventoryReleasedEvent.js";
import type { InventoryReservedEvent } from "../../modules/inventory/events/InventoryReservedEvent.js";
import type { PaymentCompletedEvent } from "../../modules/payments/events/PaymentCompletedEvent.js";

export interface EventMap {
  "payment.completed": PaymentCompletedEvent;
  "inventory.reserved": InventoryReservedEvent;
  "inventory.released": InventoryReleasedEvent; // Not really neccessary
  "fulfillment.shipped": FulfillmentShippedEvent;
  "fulfillment.delivered": FulfillmentDeliveredEvent;
}
