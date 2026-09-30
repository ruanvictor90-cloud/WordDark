const ENTRY_STATES = new Set(["RECEIVED", "AUTHORIZED"]);

export function receiveAtGate({
  id,
  source,
  destination,
  actorId = null,
  actorRole = null,
  context = {}
}) {
  if (!id || !source || !destination) throw new Error("INVALID_GATE_ENTRY");

  return {
    id,
    source,
    destination,
    actorId,
    actorRole,
    context,
    status: "RECEIVED",
    history: [
      {
        status: "RECEIVED",
        at: new Date().toISOString()
      }
    ]
  };
}

export function authorizeAtGate(entry) {
  if (!entry || entry.status !== "RECEIVED") {
    throw new Error("GATE_ENTRY_NOT_READY");
  }

  if (!entry.actorId || !entry.actorRole) {
    throw new Error("GATE_IDENTITY_REQUIRED");
  }

  return {
    ...entry,
    status: "AUTHORIZED",
    history: [
      ...entry.history,
      {
        status: "AUTHORIZED",
        actorId: entry.actorId,
        actorRole: entry.actorRole,
        at: new Date().toISOString()
      }
    ]
  };
}

export function routeFromGate(entry) {
  if (!entry || !ENTRY_STATES.has(entry.status)) {
    throw new Error("GATE_ENTRY_NOT_READY");
  }

  return {
    ...entry,
    status: "ROUTED",
    history: [
      ...entry.history,
      {
        status: "ROUTED",
        destination: entry.destination,
        at: new Date().toISOString()
      }
    ]
  };
}
