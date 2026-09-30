export function createCommunication({id,channelId,customerId,direction="INBOUND",messages=[]}) {
  if (!id || !channelId || !customerId) throw new Error("INVALID_COMMUNICATION");
  return {id,channelId,customerId,direction,messages,history:[]};
}
