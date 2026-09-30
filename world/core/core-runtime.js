/* WordDark Core — Unified V1 + Operational Runtime
 * The central copy composes the existing operational engine with the frozen V1 foundations.
 * No second runtime world is created: V1 supplies structure; the operational engine remains the executor.
 */
const WorldDarkWorldRuntime=require("./world-runtime");
const EntityRegistry=require("./entity-registry");
const Permission=require("./permissions");
const Gate=require("./gate");
const ServiceRegistry=require("./service");
const Recovery=require("./error-recovery");
const Inbox=require("./inbox");
const Versioning=require("./versioning");
const Id=require("./id");
const Result=require("./result");
class WordDarkCoreRuntime extends WorldDarkWorldRuntime{
 constructor(options={}){
  super(options);
  this.entityRegistry=options.entityRegistry||new EntityRegistry();
  this.permissions=options.permissions||new Permission.WordDarkPermissionSet();
  this.gates=options.gates||new Map();
  this.services=options.services||new ServiceRegistry();
  this.recovery=options.recovery||new Recovery();
  this.inbox=options.inbox||new Inbox();
  this.versioning=options.versioning||new Versioning();
  this.coreVersion="V1-INTEGRATED";
  this.name="WordDark Core Runtime";
 }
 registerEntity(entity){return this.entityRegistry.register(entity);}
 addGate(gate){const v=gate.validate();if(!v.valid)throw new Error(v.errors.join(" "));this.gates.set(gate.gateId,gate);return gate;}
 grantPermission(rule){return this.permissions.grant(rule);}
 registerService(service){return this.services.register(service);}
 processCoreRequest({operation,gateId,permissionRequest}={}){
  if(!operation)throw new Error("operation é obrigatório.");
  const gate=this.gates.get(gateId);if(!gate)throw new Error("GATE_NOT_FOUND");
  const user=this.entityRegistry.get(operation.requesterId);
  const gateResult=gate.receive({profile:user&&user.profile,context:operation.context||null});
  if(!gateResult.success)return {success:false,status:"REJECTED",stage:"GATE",reason:gateResult.reason};
  if(permissionRequest&&!this.permissions.authorize(permissionRequest))return {success:false,status:"REJECTED",stage:"PERMISSION",reason:"ACCESS_DENIED"};
  try{
   const execution=this.runOperation(operation.toLegacy?operation.toLegacy():operation);
   const result=new Result({resultId:Id.create("RESULT",Date.now()),operationId:operation.operationId,status:execution.status==="COMPLETED"?"READY":"FAILED",report:execution.toJSON?execution.toJSON():execution});
   this.versioning.create(operation.operationId,result.toJSON());
   this.inbox.notify({type:"RESULT_READY",operationId:operation.operationId,resultId:result.resultId});
   return {success:execution.status==="COMPLETED",status:execution.status,result};
  }catch(error){
   const record=this.recovery.capture(operation,error,"CORE_RUNTIME");
   this.inbox.pend({type:"OPERATION_ERROR",operationId:operation.operationId,errorId:record.errorId});
   return {success:false,status:"FAILED",error:record};
  }
 }
 getCoreStatus(){return {...this.getStatus(),coreVersion:this.coreVersion,entities:this.entityRegistry.entities.size,gates:this.gates.size,services:this.services.services.size,pending:this.inbox.getOpen().length};}
}
if(typeof module!=="undefined")module.exports=WordDarkCoreRuntime;if(typeof window!=="undefined")window.WordDarkCoreRuntime=WordDarkCoreRuntime;