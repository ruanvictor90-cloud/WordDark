/*
 * Dark Factory — Request Core
 * DF-0.1
 *
 * Responsabilidade:
 * Criar e validar a estrutura básica de uma solicitação.
 */

class DarkFactoryRequest {

  constructor({
    requester,
    origin,
    destination,
    task,
    permission = "pending"
  }) {

    this.id = DarkFactoryRequest.generateId();

    this.requester = requester;
    this.origin = origin;
    this.destination = destination;
    this.task = task;

    this.permission = permission;

    this.status = "PENDENTE";

    this.createdAt = new Date().toISOString();
  }


  static generateId() {

    const timestamp = Date.now()
      .toString(36)
      .toUpperCase();

    return `DF-${timestamp}`;
  }


  validate() {

    const errors = [];

    if (!this.requester) {
      errors.push("Solicitante não informado.");
    }

    if (!this.origin) {
      errors.push("Origem não informada.");
    }

    if (!this.destination) {
      errors.push("Destino não informado.");
    }

    if (!this.task) {
      errors.push("Tarefa não informada.");
    }

    if (!["pending", "approved", "rejected"].includes(this.permission)) {
      errors.push("Permissão inválida.");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }


  authorize() {

    if (this.permission !== "approved") {

      this.status = "AGUARDANDO AUTORIZAÇÃO";

      return false;
    }

    this.status = "AUTORIZADA";

    return true;
  }


  reject(reason = "Solicitação rejeitada.") {

    this.status = "REJEITADA";

    this.rejectionReason = reason;
  }


  toJSON() {

    return {
      id: this.id,
      requester: this.requester,
      origin: this.origin,
      destination: this.destination,
      task: this.task,
      permission: this.permission,
      status: this.status,
      rejectionReason: this.rejectionReason || null,
      createdAt: this.createdAt
    };
  }

}


/*
 * Disponibiliza o módulo para uso pela Dark Factory.
 */

if (typeof window !== "undefined") {
  window.DarkFactoryRequest = DarkFactoryRequest;
}
