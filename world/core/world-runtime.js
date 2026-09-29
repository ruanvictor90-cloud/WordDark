const WordDarkOperation = require("../contracts/operation");

/* WordDark — World Runtime
 * Junta as fundações do mundo sem absorver as responsabilidades de cada camada.
 *
 * Fluxo:
 * Account/Identity -> Environment -> Operation -> Security -> Road -> Executor
 * -> Registry/Libraries
 */
class WordDarkWorldRuntime {
  constructor({
    accountManager = null,
    security = null,
    environmentGuard = null,
    road = null,
    registry = null,
    operationEngine = null
  } = {}) {
    this.accountManager = accountManager;
    this.security = security;
    this.environmentGuard = environmentGuard;
    this.road = road;
    this.registry = registry;
    this.operationEngine = operationEngine;
    this.name = "WordDark Runtime";
    this.version = "0.1";
    this.status = "ONLINE";\n    this.components = {\n      accountManager: !!this.accountManager,\n      security: !!this.security,\n      environmentGuard: !!this.environmentGuard,\n      road: !!this.road,\n      registry: !!this.registry,\n      operationEngine: !!this.operationEngine\n    };
  }

  createOperation(source = {}) {
    if (!this.operationEngine) throw new Error("Operation Engine não configurado.");
    return this.operationEngine.create(source);
  }

  runOperation(source = {}) {
    const operation = source instanceof WordDarkOperation
      ? source
      : this.createOperation(source);
    return this.operationEngine.run(operation);
  }

  getStatus() {
    return {
      name:this.name,
      version:this.version,
      status:this.status,
      accounts:this.accountManager ? this.accountManager.accounts.size : 0,
      identities:this.security ? this.security.identities.size : 0,
      routes:this.road ? this.road.routes.size : 0,
      operations:this.registry ? this.registry.list().length : 0,
      events:this.registry ? this.registry.events.length : 0
    };
  }
}

if (typeof module !== "undefined") module.exports = WordDarkWorldRuntime;
if (typeof window !== "undefined") window.WordDarkWorldRuntime = WordDarkWorldRuntime;
