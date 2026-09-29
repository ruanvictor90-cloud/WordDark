const WordDarkOperation = typeof require === "function"
  ? require("../contracts/operation")
  : (typeof window !== "undefined" ? window.WordDarkOperation : null);

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
    this.version = "0.2";
    this.status = "ONLINE";
    this.components = {
      accountManager: !!this.accountManager,
      security: !!this.security,
      environmentGuard: !!this.environmentGuard,
      road: !!this.road,
      registry: !!this.registry,
      operationEngine: !!this.operationEngine
    };
  }

  static compose(components = {}) {
    const runtime = new WordDarkWorldRuntime(components);
    const health = runtime.getHealth();
    if (!health.ready) {
      throw new Error("WordDark Runtime não está pronto: " + health.missing.join(", "));
    }
    return runtime;
  }

  assertReady() {
    const health = this.getHealth();
    if (!health.ready) {
      throw new Error("WordDark Runtime não está pronto: " + health.missing.join(", "));
    }
    return true;
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
      components:{...this.components},
      accounts:this.accountManager ? this.accountManager.accounts.size : 0,
      identities:this.security ? this.security.identities.size : 0,
      routes:this.road ? this.road.routes.size : 0,
      operations:this.registry ? this.registry.list().length : 0,
      events:this.registry ? this.registry.events.length : 0
    };
  }

  getHealth() {
    const checks = {
      accountManager: !!this.accountManager && typeof this.accountManager.get === "function",
      security: !!this.security &&
        typeof this.security.registerIdentity === "function" &&
        typeof this.security.authorize === "function",
      environmentGuard: !!this.environmentGuard &&
        typeof this.environmentGuard.canRun === "function",
      road: !!this.road &&
        typeof this.road.registerRoute === "function" &&
        typeof this.road.findRoute === "function" &&
        typeof this.road.send === "function",
      registry: !!this.registry &&
        typeof this.registry.record === "function" &&
        typeof this.registry.recordEvent === "function" &&
        typeof this.registry.list === "function",
      operationEngine: !!this.operationEngine &&
        typeof this.operationEngine.create === "function" &&
        typeof this.operationEngine.run === "function"
    };

    const missing = Object.keys(checks).filter(key => !checks[key]);

    return {
      status: missing.length === 0 ? "HEALTHY" : "DEGRADED",
      ready: missing.length === 0,
      checks,
      missing
    };
  }

  isReady() {
    return this.getHealth().ready;
  }
}

if (typeof module !== "undefined") module.exports = WordDarkWorldRuntime;
if (typeof window !== "undefined") window.WordDarkWorldRuntime = WordDarkWorldRuntime;
