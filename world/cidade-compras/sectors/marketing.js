export const MARKETING_STATES = Object.freeze(["REQUESTED","PLANNED","SENT_TO_FACTORY","RESULT_RETURNED","READY_FOR_DISTRIBUTION"]);
export function createMarketingRequest({ id, source, brief, channelIds = [], campaignId = null }) {
  if (!id || !source || !brief) throw new Error("INVALID_MARKETING_REQUEST");
  return { id, source, brief, channelIds, campaignId, status:"REQUESTED", currentService:"MARKETING", nextService:"MARKETING", history:[{status:"REQUESTED",service:"MARKETING",at:new Date().toISOString()}] };
}
export function planMarketingRequest(request) {
  if (request.status !== "REQUESTED") throw new Error("MARKETING_REQUEST_NOT_READY");
  return {...request,status:"PLANNED",currentService:"MARKETING",nextService:"DARK_FACTORY",history:[...request.history,{status:"PLANNED",service:"MARKETING",nextService:"DARK_FACTORY",at:new Date().toISOString()}]};
}
export function sendToFactory(request) {
  if (request.status !== "PLANNED") throw new Error("MARKETING_REQUEST_NOT_PLANNED");
  return {...request,status:"SENT_TO_FACTORY",currentService:"DARK_FACTORY",nextService:"DARK_FACTORY",history:[...request.history,{status:"SENT_TO_FACTORY",service:"DARK_FACTORY",at:new Date().toISOString()}]};
}
export function receiveFactoryResult(request,resultId) {
  if (request.status !== "SENT_TO_FACTORY" || !resultId) throw new Error("FACTORY_RESULT_NOT_READY");
  return {...request,status:"RESULT_RETURNED",currentService:"MARKETING",nextService:"MARKETING",resultId,history:[...request.history,{status:"RESULT_RETURNED",service:"MARKETING",resultId,at:new Date().toISOString()}]};
}
export function prepareDistribution(request) {
  if (request.status !== "RESULT_RETURNED") throw new Error("MARKETING_RESULT_NOT_READY");
  return {...request,status:"READY_FOR_DISTRIBUTION",currentService:"MARKETING",nextService:"CHANNEL",history:[...request.history,{status:"READY_FOR_DISTRIBUTION",service:"CHANNEL",at:new Date().toISOString()}]};
}