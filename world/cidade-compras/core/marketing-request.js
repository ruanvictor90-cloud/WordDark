export function createMarketingRequest({id,source,channelId,brief,requestedBy}) {
  if (!id || !source || !brief || !requestedBy) throw new Error("INVALID_MARKETING_REQUEST");
  return {id,source,channelId:channelId ?? null,brief,requestedBy,status:"REQUESTED",destinationService:"DARK_FACTORY"};
}
