export const INTENTS = Object.freeze(["PRODUCT","PRICE","ORDER","TRACKING","PAYMENT","EXCHANGE","REFUND","HUMAN"]);
export function createAttendant({id,name="Commerce Attendant",channels=[]}) {
  if (!id) throw new Error("INVALID_ATTENDANT");
  return {id,name,channels,intents:[...INTENTS],handoffPolicy:"HUMAN_WHEN_REQUIRED"};
}
