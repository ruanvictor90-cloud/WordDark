/* WordDark — Operation Engine
 * Núcleo mínimo para executar o circuito de uma operação.
 * Não substitui identidade, segurança, routing ou executores especializados.
 */

class WordDarkOperationEngine {
  constructor(options = {}) {
    this.security = options.security || null;
    this.authorize = options.authorize || ((operation) => {
      if (!this.security) return { allowed: false, reason: "Autorização não configurada." };
      const payload = operation.payload || {};
      return this.security.authorize({
        identityId: payload.identityId || operation.requesterId,
        operationId: operation.operationId,
        capability: payload.capability || operation.operationType,
        action: payload.action || "request",
        environment: operation.environment,
        scope: payload.scope || operation.destinationId || "*"
      });
    });
    this.route = options.route || (() => ({ success: false, reason: "Roteamento não configurado." }));
    this.execute = options.execute || (() => ({ success: false, reason: "Executor não configurado." }));
    this.registry = options.registry || null;
    this.environmentGuard = options.environmentGuard || null;
    this.record = options.record || (() => {});
    this.idPrefix = options.idPrefix || "OP";
  }

  generateId() {
    return this.idPrefix + "-" + Date.now().toString(36).toUpperCase() + "-" +
      Math.random().toString(36).substring(2,6).toUpperCase();
  }

  create(source = {}) {
    const operation = new WordDarkOperation({
      ...source,
      operationId: source.operationId || this.generateId()
    });
    const validation = operation.validate();
    if (!validation.valid) {
      operation.transition("REJECTED", { stage:"VALIDATION", errors:validation.errors });
    }
    return operation;
  }

  recordStage(operation, data = {}) {
    this.record(operation);
    if (this.registry && typeof this.registry.recordEvent === "function") {
      this.registry.recordEvent(operation, operation.status, data);
    }
  }

  run(operation) {
    if (!(operation instanceof WordDarkOperation)) {
      throw new Error("O engine exige uma instância de WordDarkOperation.");
    }

    const initial = operation.validate();
    if (!initial.valid) {
      if (operation.status === "CREATED") operation.transition("REJECTED", { stage:"VALIDATION", errors:initial.errors });
      this.recordStage(operation);
      return operation;
    }

    operation.transition("IDENTIFIED");
    this.recordStage(operation);

    if (this.environmentGuard && typeof this.environmentGuard.canRun === "function") {
      const environment = this.environmentGuard.canRun(operation);
      if (!environment || environment.allowed !== true) {
        operation.transition("BLOCKED", {
          stage:"ENVIRONMENT",
          reason:(environment && environment.reason) || "Ambiente bloqueado."
        });
        this.recordStage(operation);
        return operation;
      }
    }

    const authorization = this.authorize(operation);
    if (!authorization || authorization.allowed !== true) {
      operation.transition("REJECTED", {
        stage:"AUTHORIZATION",
        reason:(authorization && authorization.reason) || "Operação não autorizada."
      });
      this.recordStage(operation);
      return operation;
    }

    operation.transition("AUTHORIZED", { authorization: authorization.reference || null });
    this.recordStage(operation);

    const routing = this.route(operation);
    if (!routing || routing.success !== true) {
      operation.transition("BLOCKED", {
        stage:"ROUTING",
        reason:(routing && routing.reason) || "Rota indisponível."
      });
      this.recordStage(operation);
      return operation;
    }

    operation.transition("ROUTED", { routeId:routing.routeId || null });
    this.recordStage(operation);

    operation.transition("EXECUTING");
    this.recordStage(operation);

    const execution = this.execute(operation);
    if (!execution || execution.success !== true) {
      operation.transition("FAILED", {
        stage:"EXECUTION",
        reason:(execution && execution.reason) || "Execução falhou."
      });
      this.recordStage(operation);
      return operation;
    }

    operation.transition("VALIDATING", { execution:execution.result || execution });
    this.recordStage(operation);

    const validation = execution.validated === false ? {
      success:false,
      reason:execution.validationReason || "Resultado não validado."
    } : { success:true };

    if (!validation.success) {
      operation.transition("FAILED", { stage:"VALIDATION", reason:validation.reason });
      this.recordStage(operation);
      return operation;
    }

    operation.transition("COMPLETED", {
      routeId:routing.routeId || null,
      execution:execution.result || execution
    });
    this.recordStage(operation);
    return operation;
  }
}

if (typeof module !== "undefined") module.exports = WordDarkOperationEngine;
if (typeof window !== "undefined") window.WordDarkOperationEngine = WordDarkOperationEngine;
