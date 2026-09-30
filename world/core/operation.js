/* WordDark Core — Unified Operation Model
 * V1 context/history/package semantics layered onto the consolidated operation contract.
 */
const BaseOperation=require("../contracts/operation");
class WordDarkCoreOperation extends BaseOperation{
 constructor(source={}){
  super(source);
  this.clientId=source.clientId||null;
  this.projectId=source.projectId||null;
  this.resourceId=source.resourceId||null;
  this.serviceId=source.serviceId||source.operationType||null;
  this.context=source.context||null;
  this.request=source.request||{};
  this.resources=Array.isArray(source.resources)?[...source.resources]:[];
  this.history=Array.isArray(source.history)?[...source.history]:[];
  this.version=source.version||1;
 }
 addHistory(event,data={}){const h={event,timestamp:new Date().toISOString(),data};this.history.push(h);return h;}
 toLegacy(){
  return new BaseOperation({...this.toJSON(),operationType:this.operationType||this.serviceId,payload:{...this.payload,clientId:this.clientId,projectId:this.projectId,resourceId:this.resourceId,serviceId:this.serviceId,context:this.context,request:this.request,resources:this.resources,history:this.history}});
 }
 toJSON(){return {...super.toJSON(),clientId:this.clientId,projectId:this.projectId,resourceId:this.resourceId,serviceId:this.serviceId,context:this.context,request:this.request,resources:[...this.resources],history:[...this.history],version:this.version};}
}
if(typeof module!=="undefined")module.exports=WordDarkCoreOperation;if(typeof window!=="undefined")window.WordDarkCoreOperation=WordDarkCoreOperation;