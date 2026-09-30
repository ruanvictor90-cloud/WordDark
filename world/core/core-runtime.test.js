const assert=require("assert");
const CoreRuntime=require("./core-runtime");
const CoreOperation=require("./operation");
const Gate=require("./gate");
const {WordDarkUser}=require("./entities");
const {WordDarkPermission}=require("./permissions");
const runtime=new CoreRuntime({
 accountManager:{get:()=>null,accounts:new Map()},
 security:{registerIdentity(){},authorize(){return {allowed:true};},identities:new Map()},
 environmentGuard:{canRun:()=>({allowed:true})},
 road:{routes:new Map(),registerRoute(){},findRoute(){return null;},send(){return {success:true};}},
 registry:{list:()=>[],record(){},recordEvent(){}},
 operationEngine:{create(){},run(operation){return operation;}}
});
const user=new WordDarkUser({id:"WD-USR-0001",name:"Tester",profile:"ADMIN"});
runtime.registerEntity(user);
runtime.addGate(new Gate({gateId:"WD-GATE-0001",destinationId:"CORE",allowedProfiles:["ADMIN"]}));
runtime.grantPermission(new WordDarkPermission({profile:"ADMIN",capability:"core.execute",action:"request",resourceId:"R1",clientId:"C1",environment:"TEST"}));
const op=new CoreOperation({operationId:"WD-OP-0001",requesterId:user.id,originId:"C1",destinationId:"CORE",operationType:"core.execute",clientId:"C1",resourceId:"R1",serviceId:"core.execute",environment:"TEST"});
assert.strictEqual(runtime.getCoreStatus().coreVersion,"V1-INTEGRATED");
const denied=runtime.processCoreRequest({operation:op,gateId:"WD-GATE-0001",permissionRequest:{profile:"ADMIN",capability:"wrong",action:"request",resourceId:"R1",clientId:"C1",environment:"TEST"}});
assert.strictEqual(denied.success,false);
console.log("WordDark Core unified integration tests: OK");