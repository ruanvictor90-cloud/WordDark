const assert = require("assert");
const { WordDarkOperation } = require("../contracts/operation");
const { WordDarkOperationRegistry } = require("./operation-registry");
const { WordDarkLocalLibrary } = require("../library/local-library");
const { WordDarkCentralLibrary } = require("../library/central-library");

const localLibrary = new WordDarkLocalLibrary({ libraryId: "LIB-TEST-LOCAL", ownerId: "UNIT-TEST" });
const centralLibrary = new WordDarkCentralLibrary();
const registry = new WordDarkOperationRegistry({ localLibrary, centralLibrary });

const operation = new WordDarkOperation({
  operationId: "OP-TEST-001",
  requesterId: "UNIT-TEST",
  originId: "UNIT-TEST",
  destinationId: "world/sky/darkfactory",
  operationType: "content.produce"
});

registry.recordEvent(operation, "CREATED", { test: true });

assert.ok(registry.get("OP-TEST-001"));
assert.strictEqual(registry.getEvents("OP-TEST-001").length, 1);
assert.ok(localLibrary.get("OPERATION-OP-TEST-001"));
assert.ok(localLibrary.get(registry.getEvents("OP-TEST-001")[0].eventId));
assert.ok(centralLibrary.get(registry.getEvents("OP-TEST-001")[0].eventId));

registry.archiveOperation(operation);
assert.strictEqual(centralLibrary.count(), 2);

localLibrary.save({
  recordId: "LEARNING-001",
  type: "LEARNING",
  operationId: "OP-TEST-001",
  data: { lesson: "teste de promoção seletiva" }
});

const promoted = registry.promoteLocalLearning("LEARNING-001", {
  reason: "LEARNING_VALIDATED"
});

assert.ok(promoted);
assert.strictEqual(promoted.type, "LEARNING_PROMOTION");
assert.strictEqual(centralLibrary.count(), 3);
assert.strictEqual(promoted.source, "LIB-TEST-LOCAL");

console.log("operation-registry.test.js: OK");
