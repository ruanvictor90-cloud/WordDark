export function createMarketingRequest({ id, source, brief, channelIds = [], campaignId = null }) {
  if (!id || !source || !brief) throw new Error("INVALID_MARKETING_REQUEST");
  return { id, source, brief, channelIds, campaignId, status: "REQUESTED", targetService: "MARKETING", history: [{ status: "REQUESTED", at: new Date().toISOString() }] };
}
export function sendToFactory(request) {
  if (!["REQUESTED","PLANNED"].includes(request.status)) throw new Error("MARKETING_REQUEST_NOT_READY");
  return { ...request, status: "SENT_TO_FACTORY", nextService: "DARK_FACTORY", history: [...request.history, { status: "SENT_TO_FACTORY", at: new Date().toISOString() }] };
}