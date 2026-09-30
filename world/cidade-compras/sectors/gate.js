export function receiveAtGate({ id, source, destination, actorId = null, context = {} }) {
  if (!id || !source || !destination) throw new Error("INVALID_GATE_ENTRY");
  return { id, source, destination, actorId, context, status: "RECEIVED", history: [{ status: "RECEIVED", at: new Date().toISOString() }] };
}
export function routeFromGate(entry) {
  if (!["RECEIVED","AUTHORIZED"].includes(entry.status)) throw new Error("GATE_ENTRY_NOT_READY");
  return { ...entry, status: "ROUTED", history: [...entry.history, { status: "ROUTED", at: new Date().toISOString() }] };
}