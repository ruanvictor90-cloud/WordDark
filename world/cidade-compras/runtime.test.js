import assert from "node:assert/strict";
import { runCommerceRuntime, recoverCommerceRuntime } from "./runtime.js";

const result = runCommerceRuntime({
  operationId:"WD-OP-CC-RUNTIME-001",
  gateId:"WD-GATE-CC-RUNTIME-001",
  messageId:"WD-MSG-CC-RUNTIME-001",
  attendanceId:"WD-ATT-CC-RUNTIME-001",
  sessionId:"WD-SES-CC-RUNTIME-001",
  accountId:"WD-ACC-CC-RUNTIME-001",
  supplierOrderId:"WD-SUPORD-CC-RUNTIME-001",
  shipmentId:"WD-SHIP-CC-RUNTIME-001",
  customerId:"WD-CUS-CC-RUNTIME-001",
  channel:"SOCIAL",
  message:"Quero comprar o produto de teste.",
  orderId:"WD-ORD-CC-RUNTIME-001",
  supplierId:"WD-SUP-CC-RUNTIME-001",
  productId:"WD-PROD-CC-RUNTIME-001",
  amount:199.90
});

assert.equal(result.status,"COMPLETED");
assert.equal(result.gate.status,"ROUTED");
assert.equal(result.communication.destination,"ATTENDANCE");
assert.equal(result.attendance.step,"CONFIRM_ORDER");
assert.equal(result.account.status,"SETTLED");
assert.equal(result.order.status,"SHIPPED");
assert.equal(result.order.total,199.90);
assert.equal(result.supplierOrder.status,"SENT");
assert.equal(result.shipment.status,"IN_TRANSIT");
assert.equal(result.operation.status,"COMMERCE_CLOSED");
assert.equal(result.operation.history.length,8);

const incident = recoverCommerceRuntime({
  operationId:"WD-OP-CC-RUNTIME-ERR-001",
  source:"LOGISTICS",
  type:"DELIVERY_EXCEPTION",
  description:"Falha simulada de entrega."
});
assert.equal(incident.status,"ANALYZING");

console.log("Commerce runtime: PASS");
