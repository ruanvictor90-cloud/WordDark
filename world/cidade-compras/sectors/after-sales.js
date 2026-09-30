export const AFTER_SALES_TYPES = Object.freeze(["TRACKING","EXCHANGE","REFUND","SUPPORT","FEEDBACK"]);
export function createAfterSalesCase({ id, orderId, customerId, type, description }) {
  if (!id || !orderId || !customerId || !AFTER_SALES_TYPES.includes(type) || !description) throw new Error("INVALID_AFTER_SALES_CASE");
  return { id, orderId, customerId, type, description, status: "OPEN", history: [{ status: "OPEN", at: new Date().toISOString() }] };
}
export function closeAfterSalesCase(caseFile, resolution) {
  return { ...caseFile, status: "CLOSED", resolution, history: [...caseFile.history, { status: "CLOSED", resolution, at: new Date().toISOString() }] };
}