export function createContentRequirement({id,commerceSource,brief,channelIds=[],campaignId=null}){
  if(!id || !commerceSource || !brief) throw new Error("INVALID_CONTENT_REQUIREMENT");
  return {id,commerceSource,brief,channelIds,campaignId,status:"REQUESTED",targetService:"MARKETING"};
}

export function dispatchToFactory(requirement){
  if(requirement.status!=="REQUESTED") throw new Error("REQUIREMENT_NOT_READY");
  return {...requirement,status:"SENT_TO_MARKETING",nextService:"DARK_FACTORY"};
}
