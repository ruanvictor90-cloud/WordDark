export const INCIDENT_STATES = Object.freeze(["OPEN","ANALYZING","RESOLVED","CANCELLED","REQUEUED"]);
export function createIncident({ id, source, operationId = null, type, description }) {
  if (!id || !source || !type || !description) throw new Error("INVALID_INCIDENT");
  return { id, source, operationId, type, description, status: "OPEN", history: [{ status: "OPEN", at: new Date().toISOString() }] };
}
export function transitionIncident(incident, status, note = null) {
  if (!INCIDENT_STATES.includes(status)) throw new Error("INVALID_INCIDENT_STATUS");
  return { ...incident, status, history: [...incident.history, { status, note, at: new Date().toISOString() }] };
}