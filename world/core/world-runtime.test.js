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

console.log("world-runtime.test: OK");
