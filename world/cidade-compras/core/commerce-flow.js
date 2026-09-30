import { createCommerceOperation, transitionOperation } from "./commerce-operation.js";
import { linkOperationResource } from "./operation-link.js";
import { transitionOrder } from "./order-lifecycle.js";

export function startCommerceFlow({ operationId, customerId, orderId, source }) {
  const operation = createCommerceOperation({ id: operationId, type: "PURCHASE", source, customerId, orderId });
  return transitionOperation(operation, "FLOW_STARTED");
}

export function attachFlowResource(operation, type, id) {
  return linkOperationResource(operation, type, id);
}

export function advanceOrder(order, nextStatus, note = null) {
  return transitionOrder(order, nextStatus, note);
}
