export const ACCOUNT_OPERATIONS = Object.freeze(["CHARGE","RECEIVE","REFUND","PAYOUT","RECONCILE"]);
export function createAccountOperation({id,orderId,type,amount,currency="BRL"}) {
  if (!id || !orderId || !ACCOUNT_OPERATIONS.includes(type)) throw new Error("INVALID_ACCOUNT_OPERATION");
  return {id,orderId,type,amount,currency,status:"PENDING"};
}
