/* WordDark — Environment Guard
 * Barreira simples entre TEST e PROD.
 * MVP: não substitui infraestrutura, secrets ou autenticação real.
 */
class WordDarkEnvironmentGuard {
  constructor({ environments = {}, productionApproval = null } = {}) {
    this.environments = environments;
    this.productionApproval = productionApproval;
  }

  canRun(operation) {
    const environment = this.environments[operation.environment];
    if (environment && typeof environment.isActive === "function" && !environment.isActive()) {
      return { allowed:false, reason:"AMBIENTE_BLOQUEADO" };
    }

    if (operation.environment === "PROD") {
      if (typeof this.productionApproval !== "function") {
        return { allowed:false, reason:"PROD_SEM_APROVACAO_CONFIGURADA" };
      }
      const approval = this.productionApproval(operation);
      if (!approval || approval.allowed !== true) {
        return { allowed:false, reason:(approval && approval.reason) || "PROD_NAO_AUTORIZADO" };
      }
    }

    return { allowed:true, reason:"ENVIRONMENT_ALLOWED" };
  }
}
if (typeof module !== "undefined") module.exports = WordDarkEnvironmentGuard;
if (typeof window !== "undefined") window.WordDarkEnvironmentGuard = WordDarkEnvironmentGuard;
