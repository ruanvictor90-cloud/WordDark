const assert = require("assert");

const Core = require("./index");
const Security = require("../security/security-manager");
const EnvironmentGuard = require("./environment-guard");
const Registry = require("./operation-registry");
const Road = require("./road");
const GlobalRoute = require("../contracts/route");

function test(name, fn) {
  try {
    fn();
    console.log("PASS", name);
  } catch (error) {
    console.error("FAIL", name, error.stack || error.message);
    process.exitCode = 1;
  }
}

const {
  Identity, Operation, Entity, EntityRegistry, Context, Permissions,
  Gate, Service, WorldRuntime, OperationEngine
} = Core;

test("CORE STRUCTURE: single entry exports all integrated sectors", () => {
  [
    Identity, Operation, Entity, EntityRegistry, Context, Permissions,
    Gate, Service, WorldRuntime, OperationEngine
  ].forEach(value => assert.ok(value));
});

test("IDENTITY + ENTITY REGISTRY: register and retrieve", () => {
  const registry = new EntityRegistry();
  const identity = new Identity({ identityId: "WD-USR-TEST-001", type: "USER", name: "Test User" });
  assert(identity.validate().valid);
  registry.register({ id: identity.identityId, type: "USER", identity: identity.toJSON() });
  assert.strictEqual(registry.get(identity.identityId).id, identity.identityId);
});

test("CONTEXT + GATE: valid entry accepted, unauthorized profile rejected", () => {
  const context = new Context({
    clientId: "WD-CLI-TEST-001",
    resourceId: "WD-CH-TEST-001",
    originId: "test/origin",
    destinationId: "test/destination",
    serviceId: "test.service",
    environment: "TEST"
  });
  assert(context.validate().valid);

  const gate = new Gate({
    gateId: "WD-GATE-TEST-001",
    destinationId: context.destinationId,
    allowedProfiles: ["CLIENT_OPERATOR"]
  });

  assert.strictEqual(
    gate.receive({ profile: "CLIENT_OPERATOR", context: context.toJSON() }).success,
    true
  );
  assert.strictEqual(
    gate.receive({ profile: "VIEWER", context: context.toJSON() }).reason,
    "PROFILE_NOT_ALLOWED"
  );
});

test("OPERATION ENGINE: authorized operation reaches COMPLETED", () => {
  const registry = new Registry();
  const permissionSet = new Permissions.WordDarkPermissionSet();
  permissionSet.grant(new Permissions.WordDarkPermission({
    profile: "CLIENT_OPERATOR",
    capability: "content.produce",
    action: "request",
    resourceId: "WD-CH-TEST-001",
    clientId: "WD-CLI-TEST-001",
    environment: "TEST"
  }));

  const gate = new Gate({
    gateId: "WD-GATE-TEST-001",
    destinationId: "test/destination",
    allowedProfiles: ["CLIENT_OPERATOR"]
  });

  const engine = new OperationEngine({
    registry,
    permissionSet,
    gateRegistry: new Map([[gate.gateId, gate]]),
    environmentGuard: new EnvironmentGuard(),
    authorize: () => ({ allowed: true, reference: "AUTH-TEST-001" }),
    route: () => ({ success: true, routeId: "WD-ROUTE-TEST-001" }),
    execute: () => ({
      success: true,
      validated: true,
      result: { status: "TEST_OK" }
    })
  });

  const operation = engine.create({
    operationId: "WD-OP-TEST-001",
    requesterId: "WD-USR-TEST-001",
    clientId: "WD-CLI-TEST-001",
    resourceId: "WD-CH-TEST-001",
    originId: "test/origin",
    destinationId: "test/destination",
    operationType: "content.produce",
    serviceId: "content.produce",
    environment: "TEST",
    context: { profile: "CLIENT_OPERATOR" },
    payload: { capability: "content.produce", action: "request" }
  });

  assert.strictEqual(operation.status, "CREATED");
  const result = engine.run(operation);
  assert.strictEqual(result.status, "COMPLETED");
  assert.strictEqual(result.result.execution.status, "TEST_OK");
});

test("BLOCKING: permission denied never reaches execution", () => {
  let executed = false;
  const registry = new Registry();
  const permissionSet = new Permissions.WordDarkPermissionSet();
  const gate = new Gate({
    gateId: "WD-GATE-TEST-002",
    destinationId: "test/destination",
    allowedProfiles: ["CLIENT_OPERATOR"]
  });

  const engine = new OperationEngine({
    registry,
    permissionSet,
    gateRegistry: new Map([[gate.gateId, gate]]),
    environmentGuard: new EnvironmentGuard(),
    authorize: () => ({ allowed: true }),
    route: () => ({ success: true, routeId: "WD-ROUTE-TEST-002" }),
    execute: () => {
      executed = true;
      return { success: true, validated: true };
    }
  });

  const operation = engine.create({
    operationId: "WD-OP-TEST-002",
    requesterId: "WD-USR-TEST-001",
    clientId: "WD-CLI-TEST-001",
    resourceId: "WD-CH-TEST-002",
    originId: "test/origin",
    destinationId: "test/destination",
    operationType: "content.produce",
    serviceId: "content.produce",
    environment: "TEST",
    context: { profile: "CLIENT_OPERATOR" },
    payload: { capability: "content.produce", action: "request" }
  });

  const result = engine.run(operation);
  assert.strictEqual(result.status, "REJECTED");
  assert.strictEqual(executed, false);
});

test("INVALID CONTEXT: operation is rejected before execution", () => {
  const engine = new OperationEngine({
    authorize: () => ({ allowed: true }),
    route: () => ({ success: true }),
    execute: () => ({ success: true, validated: true })
  });

  const operation = engine.create({
    operationId: "WD-OP-TEST-003",
    requesterId: "WD-USR-TEST-001",
    originId: "test/origin",
    destinationId: "test/destination",
    operationType: "content.produce",
    environment: "TEST"
  });

  assert.strictEqual(operation.status, "REJECTED");
  assert(operation.validate().valid === false);
});

test("PROD BARRIER: production requires separate approval", () => {
  const guard = new EnvironmentGuard();
  const result = guard.canRun({
    environment: "PROD",
    operationId: "WD-OP-TEST-004"
  });
  assert.strictEqual(result.allowed, false);
  assert.strictEqual(result.reason, "PROD_SEM_APROVACAO_CONFIGURADA");
});

test("REPLAY PROTECTION: completed operation cannot execute twice", () => {
  let executions = 0;
  const engine = new OperationEngine({
    authorize: () => ({ allowed: true }),
    route: () => ({ success: true, routeId: "WD-ROUTE-REPLAY" }),
    execute: () => {
      executions += 1;
      return { success: true, validated: true };
    }
  });

  const operation = engine.create({
    operationId: "WD-OP-TEST-005",
    requesterId: "WD-USR-TEST-001",
    clientId: "WD-CLI-TEST-001",
    resourceId: "WD-CH-TEST-001",
    originId: "test/origin",
    destinationId: "test/destination",
    operationType: "content.produce",
    serviceId: "content.produce",
    environment: "TEST"
  });

  engine.run(operation);
  engine.run(operation);
  assert.strictEqual(executions, 1);
});

test("ROAD: route registers and transports only", () => {
  const road = new Road();
  const route = new GlobalRoute({
    routeId: "WD-ROUTE-TEST-003",
    origin: "test/origin",
    destination: "test/destination",
    service: "content.produce"
  });
  assert.strictEqual(road.registerRoute(route).success, true);
  assert(road.findRoute("test/origin", "test/destination", "content.produce"));
});

test("WORLD RUNTIME: integrated Core reports healthy with one runtime", () => {
  const security = new Security();
  const entityRegistry = new EntityRegistry();
  const permissionSet = new Permissions.WordDarkPermissionSet();
  const serviceRegistry = new Service();

  const engine = new OperationEngine({
    security,
    environmentGuard: new EnvironmentGuard(),
    registry: new Registry(),
    authorize: () => ({ allowed: true }),
    route: () => ({ success: true }),
    execute: () => ({ success: true, validated: true })
  });

  const runtime = new WorldRuntime({
    accountManager: { accounts: new Map(), get: () => null },
    security,
    environmentGuard: new EnvironmentGuard(),
    road: new Road(),
    registry: engine.registry,
    operationEngine: engine,
    entityRegistry,
    permissionSet,
    serviceRegistry
  });

  const health = runtime.getHealth();
  assert.strictEqual(health.ready, true);
  assert.strictEqual(health.status, "HEALTHY");
  assert.strictEqual(runtime.getStatus().version, "1.0-V1-INTEGRATED");
});

console.log("WordDark Core — NEW SINGLE-CORE FIRE TEST: COMPLETE");
