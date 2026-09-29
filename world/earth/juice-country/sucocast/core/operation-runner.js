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

    const integration = this.core.getIntegration(context.integrationId);
    if (!integration) {
      return {
        success:false,
        status:"FAILED",
        reason:"Integração não encontrada.",
        operationId:operationId
      };
    }

    const result = integration.execute(
      operation.action || "publish",
      context.payload || {}
    );

    this.core.record({
      type:result.success ? "OPERATION_CONFIRMED" : "OPERATION_FAILED",
      operationId:operationId,
      integrationId:context.integrationId,
      result:result
    });

    return Object.assign({
      operationId:operationId
    }, result);
  }
}

if (typeof window !== "undefined") window.SucoCastOperationRunner = SucoCastOperationRunner;
if (typeof module !== "undefined" && module.exports) module.exports = SucoCastOperationRunner;
