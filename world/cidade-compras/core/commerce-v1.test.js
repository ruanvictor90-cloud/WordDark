import assert from "node:assert/strict";
import { createCommerceCity, registerChannel } from "./city.js";
import { validateCityContract } from "./city-contract.js";
import { createChannel } from "./channel.js";
import { createOrder } from "./order.js";
import { transitionOrder } from "./order-lifecycle.js";
import { startCommerceFlow, attachFlowResource } from "./commerce-flow.js";
import { createServiceResult, deliverServiceResult } from "./service-result.js";

const city = registerChannel(
  createCommerceCity({ id: "WD-CITY-COMMERCE" }),
  "WD-CH-SOCIAL"
);
assert.equal(validateCityContract(city), true);

const channel = createChannel({ id: "WD-CH-SOCIAL", type: "SOCIAL", name: "Social Test" });
assert.equal(channel.active, true);

let order = createOrder({
  id: "WD-ORD-TEST",
  customerId: "WD-USR-TEST",
  channelId: channel.id,
  items: [{ productId: "WD-PROD-1", quantity: 1 }],
  total: 100
});
order = transitionOrder(order, "AWAITING_PAYMENT");
order = transitionOrder(order, "PAID");
order = transitionOrder(order, "VALIDATING");
assert.equal(order.status, "VALIDATING");

let operation = startCommerceFlow({
  operationId: "WD-OP-TEST",
  customerId: "WD-USR-TEST",
  orderId: order.id,
  source: channel.id
});
operation = attachFlowResource(operation, "ORDER", order.id);
assert.deepEqual(operation.resources.ORDER, [order.id]);

const result = createServiceResult({
  id: "WD-RES-TEST",
  requestId: "WD-SVC-TEST",
  service: "DARK_FACTORY",
  status: "READY",
  payload: { asset: "test" }
});
assert.equal(deliverServiceResult(result).status, "DELIVERED");

console.log("cidade-compras v1 structural tests: ok");
