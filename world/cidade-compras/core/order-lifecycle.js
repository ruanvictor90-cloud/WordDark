export const ORDER_TRANSITIONS = Object.freeze({
  DRAFT: ["AWAITING_PAYMENT","CANCELLED"],
  AWAITING_PAYMENT: ["PAID","CANCELLED"],
  PAID: ["VALIDATING","REFUNDED","INCIDENT"],
  VALIDATING: ["SENT_TO_SUPPLIER","CANCELLED","INCIDENT"],
  SENT_TO_SUPPLIER: ["SUPPLIER_CONFIRMED","INCIDENT"],
  SUPPLIER_CONFIRMED: ["SHIPPED","INCIDENT"],
  SHIPPED: ["DELIVERED","INCIDENT"],
  DELIVERED: ["REFUNDED","INCIDENT"],
  CANCELLED: [],
  REFUNDED: [],
  INCIDENT: ["VALIDATING","CANCELLED","REFUNDED"]
});

export function transitionOrder(order, nextStatus, note = null) {
  if (!order || !ORDER_TRANSITIONS[order.status]?.includes(nextStatus)) {
    throw new Error("INVALID_ORDER_TRANSITION");
  }
  return {
    ...order,
    status: nextStatus,
    history: [...(order.history || []), { status: nextStatus, note, at: new Date().toISOString() }]
  };
}
