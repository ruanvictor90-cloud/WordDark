import { runCommerceRuntime } from "../runtime.js";

const uid = (prefix) => prefix + "-" + String(Date.now()).slice(-8);

export function runRealCommerceTest({
  customerId = "WD-USR-TEST",
  channel = "SOCIAL",
  message = "Quero comprar o produto de teste.",
  amount = 129.90,
  supplierId = "WD-SUP-TEST",
  productId = "WD-PROD-TEST"
} = {}) {
  const base = Date.now();
  return runCommerceRuntime({
    operationId: uid("WD-OP"),
    gateId: uid("WD-GATE"),
    messageId: uid("WD-MSG"),
    attendanceId: uid("WD-ATT"),
    sessionId: uid("WD-SES"),
    accountId: uid("WD-ACC"),
    supplierOrderId: uid("WD-SUPORD"),
    shipmentId: uid("WD-SHIP"),
    customerId,
    channel,
    actorRole: "CUSTOMER",
    message,
    orderId: uid("WD-ORD"),
    supplierId,
    productId,
    amount,
    cityId: "WD-CITY-COMMERCE"
  });
}

export function createRuntimeTimeline(result) {
  if (!result) return [];
  return [
    ["PORTÃO", result.gate?.status || "—"],
    ["COMUNICAÇÃO", result.communication?.status || "—"],
    ["ATENDIMENTO", result.attendance?.status || "—"],
    ["COMÉRCIO", result.session?.status || "—"],
    ["CONTAS", result.account?.status || "—"],
    ["PEDIDO", result.order?.status || "—"],
    ["FORNECEDOR", result.supplierOrder?.status || "—"],
    ["LOGÍSTICA", result.shipment?.status || "—"],
    ["OPERAÇÃO", result.operation?.status || "—"]
  ];
}
