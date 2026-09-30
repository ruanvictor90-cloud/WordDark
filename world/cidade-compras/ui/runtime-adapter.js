import { runCommerceRuntime, openCommerceIncident, analyzeCommerceIncident, requeueCommerceIncident, reanalyzeCommerceIncident, resolveCommerceIncident } from "../runtime.js";

const uid = (prefix) => prefix + "-" + String(Date.now()).slice(-8);

export function runRealCommerceTest({
  customerId = "WD-USR-TEST",
  channel = "SOCIAL",
  message = "Quero comprar o produto de teste.",
  amount = 129.90,
  supplierId = "WD-SUP-TEST",
  productId = "WD-PROD-TEST"
} = {}) {
  return runCommerceRuntime({
    operationId: uid("WD-OP"), gateId: uid("WD-GATE"), messageId: uid("WD-MSG"),
    attendanceId: uid("WD-ATT"), sessionId: uid("WD-SES"), accountId: uid("WD-ACC"),
    supplierOrderId: uid("WD-SUPORD"), shipmentId: uid("WD-SHIP"), customerId, channel,
    actorRole: "CUSTOMER", message, orderId: uid("WD-ORD"), supplierId, productId, amount,
    cityId: "WD-CITY-COMMERCE"
  });
}

export function runIncidentStep(action, state) {
  if (!state?.operation || !state?.incident) throw new Error("INCIDENT_RUNTIME_STATE_REQUIRED");
  const common = { operation: state.operation, incident: state.incident };
  if (action === "OPEN") return openCommerceIncident({ ...common, order: state.order || null, incidentId: uid("WD-ERR"), source: "UI_RUNTIME", type: "DELIVERY_EXCEPTION", description: "Ocorrência aberta pelo console operacional." });
  if (action === "ANALYZE") return analyzeCommerceIncident(common);
  if (action === "REQUEUE") return requeueCommerceIncident(common);
  if (action === "REANALYZE") return reanalyzeCommerceIncident(common);
  if (action === "RESUME") return resolveCommerceIncident({ ...common, order: state.order || null, resolution: "Fluxo liberado após análise.", action: "RESUME" });
  if (action === "REFUND") return resolveCommerceIncident({ ...common, order: state.order || null, resolution: "Reembolso encaminhado após análise.", action: "REFUND" });
  if (action === "CANCEL") return resolveCommerceIncident({ ...common, order: state.order || null, resolution: "Pedido cancelado após análise.", action: "CANCEL" });
  throw new Error("UNKNOWN_INCIDENT_ACTION");
}

export function createRuntimeTimeline(result) {
  if (!result) return [];
  return [
    ["PORTÃO", result.gate?.status || "—"], ["COMUNICAÇÃO", result.communication?.status || "—"],
    ["ATENDIMENTO", result.attendance?.status || "—"], ["COMÉRCIO", result.session?.status || "—"],
    ["CONTAS", result.account?.status || "—"], ["PEDIDO", result.order?.status || "—"],
    ["FORNECEDOR", result.supplierOrder?.status || "—"], ["LOGÍSTICA", result.shipment?.status || "—"],
    ["OPERAÇÃO", result.operation?.status || "—"]
  ];
}
