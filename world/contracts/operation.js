/* WordDark — Global Operation Contract
 * Marco Zero: contrato conceitual de uma operação.
 * Este módulo não executa operações; apenas define sua identidade e estado.
 */

class WordDarkOperation {
  constructor(source = {}) {
    this.operationId = source.operationId || null;
    this.requesterId = source.requesterId || null;
    this.originId = source.originId || null;
    this.destinationId = source.destinationId || null;
    this.operationType = source.operationType || null;
    this.environment = source.environment || "TEST";
    this.status = source.status || "CREATED";
    this.parentOperationId = source.parentOperationId || null;
    this.payload = source.payload || {};
    this.result = source.result || null;
    this.createdAt = source.createdAt || new Date().toISOString();
    this.updatedAt = source.updatedAt || this.createdAt;
  }

  static get STATUSES() {
    return [
      "CREATED",
      "IDENTIFIED",
      "AUTHORIZED",
      "ROUTED",
      "EXECUTING",
      "VALIDATING",
      "COMPLETED",
      "REJECTED",
      "BLOCKED",
      "FAILED",
      "CANCELLED"
    ];
  }

  static get ENVIRONMENTS() {
    return ["TEST", "PROD"];
  }

  validate() {
    const errors = [];

    if (!this.operationId) errors.push("operationId é obrigatório.");
    if (!this.requesterId) errors.push("requesterId é obrigatório.");
    if (!this.originId) errors.push("originId é obrigatório.");
    if (!this.operationType) errors.push("operationType é obrigatório.");
    if (!WordDarkOperation.ENVIRONMENTS.includes(this.environment)) {
      errors.push("environment deve ser TEST ou PROD.");
    }
    if (!WordDarkOperation.STATUSES.includes(this.status)) {
      errors.push("status de operação inválido.");
    }

    return { valid: errors.length === 0, errors };
  }

  transition(status, result = null) {
    if (!WordDarkOperation.STATUSES.includes(status)) {
      throw new Error("Estado de operação inválido: " + status);
    }

    this.status = status;
    this.result = result;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  toJSON() {
    return {
      operationId: this.operationId,
      requesterId: this.requesterId,
      originId: this.originId,
      destinationId: this.destinationId,
      operationType: this.operationType,
      environment: this.environment,
      status: this.status,
      parentOperationId: this.parentOperationId,
      payload: this.payload,
      result: this.result,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

if (typeof module !== "undefined") module.exports = WordDarkOperation;
if (typeof window !== "undefined") window.WordDarkOperation = WordDarkOperation;