/* WordDark — SucoCast Operation Runner
 * Orquestra uma operação registrada com um adaptador externo.
 */
class SucoCastOperationRunner {
  constructor(core, permissions) {
    this.core = core;
    this.permissions = permissions;
  }

  run(operationId, input) {
    const context = input || {};
    const operation = this.core.getOperation(operationId);

    if (!operation) {
      return {
        success:false,
        status:"REJECTED",
        reason:"Operação não registrada.",
        operationId:operationId
      };
    }

    const actor = context.actor || (this.core.identity && this.core.identity.identityId);
    const capability = operation.capability;

    if (capability && !this.permissions.can(actor, capability)) {
      return {
        success:false,
        status:"REJECTED",
        reason:"Capacidade não concedida.",
        operationId:operationId
      };
    }

    const integrationId = context.integrationId;
    if (!integrationId) {
      return {
        success:false,
        status:"REJECTED",
        reason:"Integração não selecionada.",
        operationId:operationId
      };
    }

    if (Array.isArray(operation.compatibleIntegrations) &&
        operation.compatibleIntegrations.length > 0 &&
        !operation.compatibleIntegrations.includes(integrationId)) {
      return {
        success:false,
        status:"REJECTED",
        reason:"Integração incompatível com a operação.",
        operationId:operationId,
        integrationId:integrationId
      };
    }

    const integration = this.core.getIntegration(integrationId);
    if (!integration) {
      return {
        success:false,
        status:"FAILED",
        reason:"Integração não encontrada.",
        operationId:operationId,
        integrationId:integrationId
      };
    }

    const result = integration.execute(
      operation.action || "publish",
      context.payload || {}
    );

    this.core.record({
      type:result.success ? "OPERATION_CONFIRMED" : "OPERATION_FAILED",
      operationId:operationId,
      integrationId:integrationId,
      result:result
    });

    return Object.assign({
      operationId:operationId,
      integrationId:integrationId
    }, result);
  }
}

if (typeof window !== "undefined") window.SucoCastOperationRunner = SucoCastOperationRunner;
if (typeof module !== "undefined" && module.exports) module.exports = SucoCastOperationRunner;
