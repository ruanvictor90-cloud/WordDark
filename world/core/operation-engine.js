/* WordDark — Operation Engine
 * Núcleo mínimo para executar o circuito de uma operação.
 * Segurança: identidade, autorização, ambiente e proteção contra replay.
 * Compatível com Node/CommonJS e navegador sem depender de detecção ambígua de require.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("../contracts/operation"));
    return;
  }

  const browserRoot = root || (typeof window !== "undefined" ? window : globalThis);
  browserRoot.WordDarkOperationEngine = factory(browserRoot.WordDarkOperation);
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this), function (WordDarkOperation) {
  class WordDarkOperationEngine {
    constructor(options = {}) {
      this.security = options.security || null;
      this.authorize = options.authorize || ((operation) => {
        if (!this.security) return {allowed:false,reason:"Autorização não configurada."};
        const payload = operation.payload || {};
        return this.security.authorize({
          identityId:payload.identityId || operation.requesterId,
          operationId:operation.operationId,
          capability:payload.capability || operation.operationType,
          action:payload.action || "request",
          environment:operation.environment,
          scope:payload.scope || operation.destinationId || "*"
        });
      });
      this.route = options.route || (() => ({success:false,reason:"Roteamento não configurado."}));
      this.execute = options.execute || (() => ({success:false,reason:"Executor não configurado."}));
      this.registry = options.registry || null;
      this.environmentGuard = options.environmentGuard || null;
      this.record = options.record || (() => {});
      this.idPrefix = options.idPrefix || "OP";
      this.completedOperations = new Set();
      this.emergencyStop = options.emergencyStop || null;
      this.diagnostics = options.diagnostics || null;
      this.learningEngine = options.learningEngine || null;
    }

    generateId() {
      return this.idPrefix+"-"+Date.now().toString(36).toUpperCase()+"-"+Math.random().toString(36).substring(2,6).toUpperCase();
    }

    create(source = {}) {
      const operation = new WordDarkOperation({...source,operationId:source.operationId||this.generateId()});
      const validation = operation.validate();
      if (!validation.valid) operation.transition("REJECTED",{stage:"VALIDATION",errors:validation.errors});
      return operation;
    }

    recordStage(operation,data={}) {
      this.record(operation);
      if(this.registry&&typeof this.registry.recordEvent==="function") this.registry.recordEvent(operation,operation.status,data);
    }

    finalizeDiagnostic(operation) {
      if (!this.diagnostics || typeof this.diagnostics.diagnose !== "function") return null;
      const report = this.diagnostics.diagnose(operation);
      if (report && report.status === "FAILED" && this.learningEngine && typeof this.learningEngine.fromDiagnostic === "function") {
        const learning = this.learningEngine.fromDiagnostic(report);
        if (learning && this.registry && typeof this.registry.recordEvent === "function") {
          this.registry.recordEvent(operation, "LEARNING_CANDIDATE_CREATED", { knowledgeId: learning.knowledgeId, diagnosticId: report.diagnosticId });
        }
      }
      return report;
    }

    run(operation) {
      if (!(operation instanceof WordDarkOperation)) throw new Error("O engine exige uma instância de WordDarkOperation.");

      const emergencyCheck=()=>{
        if(!this.emergencyStop || typeof this.emergencyStop.assertRunning!=="function") return {allowed:true};
        return this.emergencyStop.assertRunning(operation.operationId);
      };
      const cancelIfStopped=(stage)=>{
        const check=emergencyCheck();
        if(check.allowed) return false;
        if(!WordDarkOperation.TERMINAL_STATUSES.includes(operation.status)){
          operation.transition("CANCELLED",{stage,reason:"EMERGENCY_STOP_ACTIVE",stopId:check.stopId||null,sectorId:check.sectorId||null});
          this.recordStage(operation,{stage,reason:"EMERGENCY_STOP_ACTIVE",stopId:check.stopId||null,sectorId:check.sectorId||null});
          this.finalizeDiagnostic(operation);
        }
        return true;
      };

      if(this.completedOperations.has(operation.operationId)){
        operation.replayBlocked=true;
        this.recordStage(operation,{stage:"SECURITY",reason:"OPERATION_ALREADY_COMPLETED"});
        return operation;
      }

      const initial=operation.validate();
      if(!initial.valid){
        if(operation.status==="CREATED") operation.transition("REJECTED",{stage:"VALIDATION",errors:initial.errors});
        this.recordStage(operation);
        this.finalizeDiagnostic(operation);
        return operation;
      }

      if(cancelIfStopped("PRE_EXECUTION")) return operation;

      operation.transition("IDENTIFIED");
      this.recordStage(operation);

      if(cancelIfStopped("IDENTIFIED")) return operation;

      if(this.environmentGuard&&typeof this.environmentGuard.canRun==="function"){
        const environment=this.environmentGuard.canRun(operation);
        if(!environment||environment.allowed!==true){
          operation.transition("BLOCKED",{stage:"ENVIRONMENT",reason:(environment&&environment.reason)||"Ambiente bloqueado."});
          this.recordStage(operation);
          this.finalizeDiagnostic(operation);
          return operation;
        }
      }

      if(cancelIfStopped("ENVIRONMENT")) return operation;

      const authorization=this.authorize(operation);
      if(!authorization||authorization.allowed!==true){
        operation.transition("REJECTED",{stage:"AUTHORIZATION",reason:(authorization&&authorization.reason)||"Operação não autorizada."});
        this.recordStage(operation);
        this.finalizeDiagnostic(operation);
        return operation;
      }

      if(cancelIfStopped("AUTHORIZATION")) return operation;

      operation.transition("AUTHORIZED",{authorization:authorization.reference||null});
      this.recordStage(operation);

      if(cancelIfStopped("AUTHORIZED")) return operation;

      const routing=this.route(operation);
      if(!routing||routing.success!==true){
        operation.transition("BLOCKED",{stage:"ROUTING",reason:(routing&&routing.reason)||"Rota indisponível."});
        this.recordStage(operation);
        this.finalizeDiagnostic(operation);
        return operation;
      }

      if(cancelIfStopped("ROUTING")) return operation;

      operation.transition("ROUTED",{routeId:routing.routeId||null});
      this.recordStage(operation);

      if(cancelIfStopped("ROUTED")) return operation;

      operation.transition("EXECUTING");
      this.recordStage(operation);

      const execution=this.execute(operation,{emergencyStop:this.emergencyStop});
      if(cancelIfStopped("EXECUTION")) return operation;

      if(!execution||execution.success!==true){
        operation.transition("FAILED",{stage:"EXECUTION",reason:(execution&&execution.reason)||"Execução falhou."});
        this.recordStage(operation);
        this.finalizeDiagnostic(operation);
        return operation;
      }

      operation.transition("VALIDATING",{execution:execution.result||execution});
      if(cancelIfStopped("VALIDATING")) return operation;
      this.recordStage(operation);

      const validation=execution.validated===false
        ? {success:false,reason:execution.validationReason||"Resultado não validado."}
        : {success:true};

      if(!validation.success){
        operation.transition("FAILED",{stage:"VALIDATION",reason:validation.reason});
        this.recordStage(operation);
        this.finalizeDiagnostic(operation);
        return operation;
      }

      operation.transition("COMPLETED",{routeId:routing.routeId||null,execution:execution.result||execution});
      this.completedOperations.add(operation.operationId);
      this.recordStage(operation);
      return operation;
    }
  }

  return WordDarkOperationEngine;
});