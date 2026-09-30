import { receiveAtGate, authorizeAtGate, routeFromGate } from "./sectors/gate.js";
import { receiveCommunication, handoffCommunication } from "./sectors/communication.js";
import { startAttendance, advanceAttendance } from "./sectors/attendance.js";
import { createCommerceSession, closeCommerceSession } from "./sectors/commerce.js";
import { createAccountOperation, settleAccountOperation } from "./sectors/accounts.js";
import { createSupplierOrder, sendSupplierOrder } from "./sectors/suppliers.js";
import { createShipment, updateShipment } from "./sectors/logistics.js";
import { createIncident, transitionIncident } from "./sectors/incidents.js";
import { recordCommerceKnowledge } from "./sectors/library.js";
import { createCommerceOperation, transitionOperation } from "./core/commerce-operation.js";
import { createOrder } from "./core/order.js";
import { transitionOrder } from "./core/order-lifecycle.js";
import { createAfterSalesCase } from "./sectors/after-sales.js";

export function runCommerceRuntime({
  operationId, gateId, messageId, attendanceId, sessionId, accountId,
  supplierOrderId, shipmentId, customerId, cityId = "WD-CITY-COMMERCE",
  afterSalesCaseId = null, afterSalesType = null, afterSalesDescription = null,
  channel = "SOCIAL", actorRole = "CUSTOMER", message, orderId,
  supplierId, productId, amount
}) {
  if (!operationId || !gateId || !messageId || !attendanceId || !sessionId || !accountId ||
      !supplierOrderId || !shipmentId || !customerId || !message || !orderId ||
      !supplierId || !productId || amount == null) {
    throw new Error("INVALID_COMMERCE_RUNTIME_INPUT");
  }

  let operation = createCommerceOperation({
    id: operationId, type: "PURCHASE", source: channel, customerId, orderId
  });

  const gateEntry = receiveAtGate({
    id: gateId,
    source: channel,
    destination: "COMMUNICATION",
    actorId: customerId,
    actorRole,
    context: { operationId, cityId, action: "ENTER_CITY" }
  });

  const gate = routeFromGate(authorizeAtGate(gateEntry));
  operation = transitionOperation(operation, "GATE_ACCEPTED");

  const communication = receiveCommunication({ id: messageId, channel, customerId, message });
  const handedOff = handoffCommunication(communication, "ATTENDANCE");
  operation = transitionOperation(operation, "COMMUNICATION_RECEIVED");

  const attendance = advanceAttendance(
    startAttendance({ id: attendanceId, communicationId: handedOff.id, customerId }),
    "CONFIRM_ORDER"
  );
  operation = transitionOperation(operation, "ATTENDANCE_CONFIRMED");

  const session = createCommerceSession({ id: sessionId, customerId, channel });
  operation = transitionOperation(operation, "COMMERCE_OPEN");

  let order = createOrder({
    id: orderId,
    customerId,
    channelId: channel,
    items: [{ productId, quantity: 1 }],
    total: amount
  });
  order = transitionOrder(order, "AWAITING_PAYMENT");
  operation = transitionOperation(operation, "ORDER_AWAITING_PAYMENT");

  const account = settleAccountOperation(
    createAccountOperation({ id: accountId, type: "CHARGE", orderId, amount })
  );
  order = transitionOrder(order, "PAID");
  order = transitionOrder(order, "VALIDATING");
  operation = transitionOperation(operation, "PAYMENT_SETTLED");

  const supplierOrder = sendSupplierOrder(
    createSupplierOrder({ id: supplierOrderId, orderId, supplierId, items: [{ productId, quantity: 1 }] })
  );
  order = transitionOrder(order, "SENT_TO_SUPPLIER");
  operation = transitionOperation(operation, "SUPPLIER_ORDER_SENT");

  const shipment = updateShipment(
    createShipment({ id: shipmentId, orderId }),
    "IN_TRANSIT",
    "PENDING-TRACKING"
  );
  order = transitionOrder(order, "SUPPLIER_CONFIRMED");
  order = transitionOrder(order, "SHIPPED");
  operation = transitionOperation(operation, "SHIPMENT_IN_TRANSIT");

  let afterSales = null;
  if (afterSalesCaseId || afterSalesType || afterSalesDescription) {
    if (!afterSalesCaseId || !afterSalesType || !afterSalesDescription) {
      throw new Error("INCOMPLETE_AFTER_SALES_CASE");
    }

    afterSales = createAfterSalesCase({
      id: afterSalesCaseId,
      orderId: order.id,
      customerId,
      type: afterSalesType,
      description: afterSalesDescription
    });

    operation = transitionOperation(operation, "AFTER_SALES_OPENED");
  }

  const closedSession = closeCommerceSession(session, "ORDER_CREATED");
  operation = transitionOperation(operation, "COMMERCE_CLOSED");

  const result = {
    operationId: operation.id,
    status: "COMPLETED",
    gate,
    communication: handedOff,
    attendance,
    session: closedSession,
    account,
    order,
    supplierOrder,
    afterSales,
    shipment,
    operation
  };

  recordCommerceKnowledge({
    id: `${operationId}-KNOW`,
    source: "COMMERCE_RUNTIME",
    type: "OPERATION_RESULT",
    data: { operationId, status: result.status }
  });

  return result;
}

export function recoverCommerceRuntime({
  operationId, source = "RUNTIME", type = "RUNTIME_ERROR", description
}) {
  const incident = createIncident({
    id: `${operationId}-ERR`, source, operationId, type, description
  });
  return transitionIncident(incident, "ANALYZING");
}
