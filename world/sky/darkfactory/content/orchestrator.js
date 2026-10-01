(function(root,factory){
  if(typeof module==="object"&&module.exports){
    module.exports=factory(
      require("./intelligence/sector"),
      require("./script/sector"),
      require("./identity/sector")
    );
  }else{
    root.WordDarkContentFactoryOrchestrator=factory(
      root.WordDarkContentIntelligence,
      root.WordDarkContentScript,
      root.WordDarkContentIdentity
    );
  }
})(typeof self!=="undefined"?self:this,function(Intelligence,Script,Identity){

  const VERSION="0.1.0";

  function createOperationId(input={}){
    return input.operationId || ("OP-CONTENT-"+Date.now().toString(36).toUpperCase());
  }

  function run(input={}){
    const operationId=createOperationId(input);
    const history=[];

    const intelligence=Intelligence.run({
      operationId,
      brief:input.brief,
      brand:input.brand,
      audience:input.audience,
      constraints:input.constraints,
      toolPolicy:input.toolPolicy
    });
    history.push({stage:"INTELLIGENCE",status:intelligence.status,result:intelligence.result||null,reason:intelligence.reason||null});
    if(!intelligence.success) return {success:false,status:"FAILED",operationId,stoppedAt:"INTELLIGENCE",history};

    const script=Script.run({
      operationId,
      intelligence:intelligence.result,
      brand:input.brand,
      audience:input.audience,
      format:input.format,
      constraints:input.constraints,
      toolPolicy:input.toolPolicy
    });
    history.push({stage:"SCRIPT",status:script.status,result:script.result||null,reason:script.reason||null});
    if(!script.success) return {success:false,status:"FAILED",operationId,stoppedAt:"SCRIPT",history};

    const identity=Identity.run({
      operationId,
      brief:intelligence.result.summary,
      brand:input.brand,
      audience:input.audience,
      content:script.result,
      constraints:input.constraints,
      toolPolicy:input.toolPolicy
    });
    history.push({stage:"IDENTITY",status:identity.status,result:identity.result||null,reason:identity.reason||null});
    if(!identity.success) return {success:false,status:"FAILED",operationId,stoppedAt:"IDENTITY",history};

    return {
      success:true,
      status:"READY",
      operationId,
      pipeline:["content.intelligence","content.script","content.identity"],
      history,
      packages:{
        intelligence:intelligence.result,
        script:script.result,
        identity:identity.result
      },
      next:"content.image"
    };
  }

  return {VERSION,run};
});
