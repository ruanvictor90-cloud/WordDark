/* WordDark — Message Contract
 * Mensagem é o envelope de transporte de uma operação.
 * Não autoriza e não executa.
 */
class WordDarkMessage {
  constructor(source = {}) {
    this.messageId = source.messageId || null;
    this.requestId = source.requestId || null;
    this.type = source.type || "OPERATION_REQUEST";
    this.origin = source.origin || null;
    this.destination = source.destination || null;
    this.service = source.service || null;
    this.routeId = source.routeId || null;
    this.payload = source.payload || {};
    this.createdAt = source.createdAt || new Date().toISOString();
  }

  validate() {
    const errors = [];
    if (!this.messageId) errors.push("messageId é obrigatório.");
    if (!this.requestId) errors.push("requestId é obrigatório.");
    if (!this.type) errors.push("type é obrigatório.");
    if (!this.origin) errors.push("origin é obrigatório.");
    if (!this.destination) errors.push("destination é obrigatório.");
    if (!this.service) errors.push("service é obrigatório.");
    return { valid: errors.length === 0, errors };
  }

  toJSON() {
    return {
      messageId:this.messageId, requestId:this.requestId, type:this.type,
      origin:this.origin, destination:this.destination, service:this.service,
      routeId:this.routeId, payload:this.payload, createdAt:this.createdAt
    };
  }
}
if (typeof module !== "undefined") module.exports = WordDarkMessage;
if (typeof window !== "undefined") window.WordDarkMessage = WordDarkMessage;
