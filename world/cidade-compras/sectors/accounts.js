export const ACCOUNT_OPERATIONS = Object.freeze(["CHARGE","RECEIVE","REFUND","PAYOUT","RECONCILE"]);
export function createAccountOperation({ id, type, orderId, amount, currency = "BRL" }) {
  if (!id || !ACCOUNT_OPERATIONS.includes(type) || !orderId || amount == null) throw new Error("INVALID_ACCOUNT_OPERATION");
  return { id, type, orderId, amount, currency, status: "PENDING", history: [{ status: "PENDING", at: new Date().toISOString() }] };
}
export function settleAccountOperation(operation) {
  return { ...operation, status: "SETTLED", history: [...operation.history, { status: "SETTLED", at: new Date().toISOString() }] };
}