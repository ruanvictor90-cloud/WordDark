/* WordDark Core — Operation Result */
class WordDarkResult {
 constructor(s={}){this.resultId=s.resultId||null;this.operationId=s.operationId||null;this.status=s.status||"CREATED";this.files=s.files||[];this.report=s.report||null;this.logs=s.logs||[];this.createdAt=s.createdAt||new Date().toISOString();}
 validate(){const e=[];if(!this.resultId)e.push("resultId é obrigatório.");if(!this.operationId)e.push("operationId é obrigatório.");if(!["CREATED","READY","PARTIAL","FAILED"].includes(this.status))e.push("status de resultado inválido.");return {valid:e.length===0,errors:e};}
 toJSON(){return {...this};}
}
if(typeof module!=="undefined")module.exports=WordDarkResult;
if(typeof window!=="undefined")window.WordDarkResult=WordDarkResult;
