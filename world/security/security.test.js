const assert = require("assert");
const WordDarkIdentity = require("../contracts/identity");
const WordDarkAccessRule = require("../contracts/access");
const WordDarkSecurityManager = require("./security-manager");

function runSecurityMVPTests(){
  const security = new WordDarkSecurityManager();
  security.registerIdentity(new WordDarkIdentity({identityId:"CITY-TEST",type:"UNIT"}));
  security.grant(new WordDarkAccessRule({identityId:"CITY-TEST",capability:"content.produce",action:"request",environment:"TEST",scope:"world/sky/darkfactory"}));

  const allowed = security.authorize({identityId:"CITY-TEST",operationId:"OP-001",capability:"content.produce",action:"request",environment:"TEST",scope:"world/sky/darkfactory"});
  assert.strictEqual(allowed.allowed,true);
  assert.strictEqual(allowed.reason,"AUTHORIZED");

  const unknown = security.authorize({identityId:"UNKNOWN",capability:"content.produce",action:"request",environment:"TEST",scope:"world/sky/darkfactory"});
  assert.strictEqual(unknown.allowed,false);
  assert.strictEqual(unknown.reason,"IDENTITY_NOT_FOUND");

  const wrongAction = security.authorize({identityId:"CITY-TEST",capability:"content.produce",action:"publish",environment:"TEST",scope:"world/sky/darkfactory"});
  assert.strictEqual(wrongAction.allowed,false);
  assert.strictEqual(wrongAction.reason,"ACCESS_DENIED");

  const wrongEnvironment = security.authorize({identityId:"CITY-TEST",capability:"content.produce",action:"request",environment:"PROD",scope:"world/sky/darkfactory"});
  assert.strictEqual(wrongEnvironment.allowed,false);

  const audit = security.getAudit();
  assert.strictEqual(audit.length,4);
  assert.strictEqual(audit[0].allowed,true);
  return {passed:true,auditCount:audit.length};
}

if(require.main===module) console.log(runSecurityMVPTests());
module.exports = runSecurityMVPTests;