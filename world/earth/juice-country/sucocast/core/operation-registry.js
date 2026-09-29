/* WordDark — SucoCast Operation Registry */
class SucoCastOperationRegistry {
  constructor() {
    this.operations = new Map();
  }

  register(operation) {
    if (!operation || !operation.operationId || !operation.name) {
      throw new Error("Operação precisa de operationId e name.");
    }
    this.operations.set(operation.operationId, Object.assign({
      status: "REGISTERED",
      version: "1.0"
    }, operation));
    return this.operations.get(operation.operationId);
  }

  get(operationId) {
    return this.operations.get(operationId) || null;
  }

  list() {
    return Array.from(this.operations.values());
  }
}

if (typeof window !== "undefined") window.SucoCastOperationRegistry = SucoCastOperationRegistry;
if (typeof module !== "undefined" && module.exports) module.exports = SucoCastOperationRegistry;
