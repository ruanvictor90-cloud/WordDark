class WordDarkOperationRegistry {
  constructor({ localLibrary = null, centralLibrary = null } = {}) {
    this.operations = new Map();
    this.events = [];
    this.localLibrary = localLibrary;
    this.centralLibrary = centralLibrary;
  }

  record(operation) {
    if (!operation || !operation.operationId) throw new Error("Operação inválida para registro.");
    const snapshot = typeof operation.toJSON === "function" ? operation.toJSON() : { ...operation };
    this.operations.set(operation.operationId, snapshot);
    if (this.localLibrary) this.localLibrary.save({
      recordId: "OPERATION-" + operation.operationId,
      type: "OPERATION_SNAPSHOT",
      operationId: operation.operationId,
      data: snapshot
    });
    return snapshot;
  }

  recordEvent(operation, stage, data = {}) {
    if (!operation || !operation.operationId) throw new Error("Operação inválida para evento.");
    const event = {
      eventId: "EVT-" + Date.now().toString(36).toUpperCase() + "-" +
        Math.random().toString(36).substring(2, 6).toUpperCase(),
      operationId: operation.operationId,
      stage,
      timestamp: new Date().toISOString(),
      data
    };
    this.events.push(event);
    this.record(operation);
    if (this.localLibrary) this.localLibrary.save({
      recordId: event.eventId,
      type: "OPERATION_EVENT",
      operationId: operation.operationId,
      data: event
    });
    if (this.centralLibrary) this.centralLibrary.append({
      recordId: event.eventId,
      type: "OPERATION_EVENT",
      operationId: operation.operationId,
      source: "OPERATION_REGISTRY",
      data: event
    });
    return event;
  }

  archiveOperation(operation, reason = "OPERATION_COMPLETED") {
    if (!this.centralLibrary) return null;
    const snapshot = this.record(operation);
    return this.centralLibrary.append({
      recordId: "ARCHIVE-" + operation.operationId + "-" + Date.now().toString(36).toUpperCase(),
      type: "OPERATION_ARCHIVE",
      operationId: operation.operationId,
      reason,
      data: snapshot
    });
  }

  get(operationId) { return this.operations.get(operationId) || null; }
  getEvents(operationId) { return this.events.filter(event => event.operationId === operationId); }
  list() { return [...this.operations.values()]; }
  clear() { this.operations.clear(); this.events = []; }
}

if (typeof module !== "undefined") module.exports = { WordDarkOperationRegistry };
if (typeof window !== "undefined") window.WordDarkOperationRegistry = WordDarkOperationRegistry;
