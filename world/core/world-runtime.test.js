const WordDarkOperation = require("../contracts/operation");
const WordDarkWorldRuntime = require("./world-runtime");

const calls=[];
const engine={
  create:source=>new WordDarkOperation({
    ...source,
    operationId:"OP-RUNTIME-001"
  }),
  run:operation=>{
    calls.push(operation.operationId);
    return operation;
  }
};

const runtime=new WordDarkWorldRuntime({
  operationEngine:engine,
  registry:{list:()=>[{operationId:"OP-RUNTIME-001"}],events:[{eventId:"E1"}]},
  road:{routes:new Map([["R1",{}]])},
  security:{identities:new Map([["I1",{}]])},
  accountManager:{accounts:new Map([["A1",{}]])}
});

const result=runtime.runOperation({
  requesterId:"I1",
  originId:"world/earth/test",
  operationType:"content.produce"
});

if (result.operationId !== "OP-RUNTIME-001") throw new Error("Runtime não criou a operação.");
if (calls.length !== 1) throw new Error("Runtime não executou a operação.");

const status=runtime.getStatus();
if (status.routes !== 1 || status.identities !== 1 || status.accounts !== 1) {
  throw new Error("Runtime não consolidou os módulos.");
}
if (status.components.operationEngine !== true || status.components.registry !== true) {
  throw new Error("Runtime não expôs o estado dos componentes.");
}

const health=runtime.getHealth();
if (health.status !== "DEGRADED" || health.ready !== false || !health.missing.includes("environmentGuard")) {
  throw new Error("Runtime não detectou dependência ausente.");
}
if (runtime.isReady() !== false) {
  throw new Error("Runtime marcou como pronto com dependência ausente.");
}

const completeRuntime=new WordDarkWorldRuntime({
  accountManager:{accounts:new Map([["A1",{}]])},
  security:{identities:new Map([["I1",{}]])},
  environmentGuard:{canRun:()=>({allowed:true})},
  road:{routes:new Map([["R1",{}]])},
  registry:{list:()=>[],events:[]},
  operationEngine:engine
});
if (completeRuntime.getHealth().status !== "HEALTHY" || completeRuntime.isReady() !== true) {
  throw new Error("Runtime completo não ficou pronto.");
}

console.log("world-runtime.test: OK");
