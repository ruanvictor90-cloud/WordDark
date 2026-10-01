const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=__dirname;
const files=["index.html","intelligence/index.html","intelligence/adapter.js","intelligence/sector.js","intelligence/sector.test.js","script/index.html","script/test.html","script/adapter.js","script/sector.js","script/sector.test.js","identity/index.html","identity/adapter.js","identity/sector.js","identity/sector.test.js"];
for(const file of files) assert.equal(fs.existsSync(path.join(root,file)),true,"MISSING_CONTENT_FILE:"+file);
const intelligence=require("./intelligence/sector");
const script=require("./script/sector");
const identity=require("./identity/sector");
const orchestrator=require("./orchestrator");
const intel=intelligence.run({operationId:"OP-INTEGRATION-001",brief:"anime, games, cultura geek",audience:"jovem adulto",toolPolicy:"HYBRID"});
assert.equal(intel.success,true); assert.equal(intel.result.status,"READY");
const roteiro=script.run({operationId:"OP-INTEGRATION-002",intelligence:intel.result,brand:"SucoGeek",audience:"jovem adulto",format:"SHORT",toolPolicy:"HYBRID"});
assert.equal(roteiro.success,true); assert.equal(roteiro.result.status,"READY"); assert.equal(roteiro.result.metadata.brand,"SucoGeek");
const identidade=identity.run({operationId:"OP-INTEGRATION-003",brief:intel.result.summary,brand:"SucoGeek",audience:"jovem adulto",content:roteiro.result,toolPolicy:"HYBRID"});
assert.equal(identidade.success,true); assert.equal(identidade.result.status,"READY"); assert.ok(identidade.result.assetSlots.includes("logo"));

const flow=orchestrator.run({
  operationId:"OP-CONTENT-FLOW-001",
  brief:"anime, games, cultura geek",
  brand:"SucoGeek",
  audience:"jovem adulto",
  format:"SHORT",
  toolPolicy:"HYBRID"
});
assert.equal(flow.success,true);
assert.equal(flow.status,"READY");
assert.equal(flow.operationId,"OP-CONTENT-FLOW-001");
assert.deepEqual(flow.pipeline,[
  "content.intelligence","content.script","content.identity"
]);
assert.equal(flow.history.length,3);
assert.ok(flow.history.every(step=>step.status==="READY"));
assert.equal(flow.packages.intelligence.operationId,flow.operationId);
assert.equal(flow.packages.script.operationId,flow.operationId);
assert.equal(flow.packages.identity.operationId,flow.operationId);
assert.equal(flow.packages.script.metadata.brand,"SucoGeek");
assert.ok(flow.packages.identity.assetSlots.includes("logo"));
assert.equal(flow.next,"content.image");

const failed=orchestrator.run({
  operationId:"OP-CONTENT-FLOW-FAIL-001",brief:"",brand:"SucoGeek",audience:"jovem adulto",format:"SHORT",toolPolicy:"HYBRID"
});
assert.equal(failed.success,false);
assert.equal(failed.status,"FAILED");
assert.equal(failed.stoppedAt,"INTELLIGENCE");
assert.equal(failed.history.length,1);
assert.equal(failed.history[0].reason,"BRIEF_REQUIRED");
const central=fs.readFileSync(path.join(root,"index.html"),"utf8");
assert.match(central,/href="\.\/intelligence\//); assert.match(central,/href="\.\/script\//); assert.match(central,/href="\.\/identity\//);
assert.match(central,/orchestrator\.js/);
console.log("CONTENT FACTORY INTEGRATION: PASS");