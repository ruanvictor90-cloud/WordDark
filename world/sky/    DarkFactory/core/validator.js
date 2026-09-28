/*
 * Dark Factory — Validator Core
 * DF-0.1
 *
 * Responsabilidade:
 * Validar solicitações antes que avancem no fluxo da fábrica.
 */

class DarkFactoryValidator {

  static validateRequest(request) {

    const errors = [];

    if (!request) {
      return {
        valid: false,
        errors: ["Solicitação não fornecida."]
      };
    }

    if (!request.requester) {
      errors.push("Solicitante não informado.");
    }

    if (!request.origin) {
      errors.push("Origem não informada.");
    }

    if (!request.destination) {
      errors.push("Destino não informado.");
    }

    if (!request.task) {
      errors.push("Tarefa não informada.");
    }

    if (!request.permission) {
      errors.push("Permissão não definida.");
    }

    const validPermissions = [
      "pending",
      "approved",
      "rejected"
    ];

    if (
      request.permission &&
      !validPermissions.includes(request.permission)
    ) {
      errors.push("Tipo de permissão inválido.");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }


  static canExecute(request) {

    const validation = this.validateRequest(request);

    if (!validation.valid) {
      return {
        allowed: false,
        reason: "Solicitação inválida.",
        errors: validation.errors
      };
    }

    if (request.permission !== "approved") {
      return {
        allowed: false,
        reason: "Solicitação não autorizada.",
        errors: []
      };
    }

    return {
      allowed: true,
      reason: "Solicitação autorizada para execução.",
      errors: []
    };
  }

}


/*
 * Disponibiliza o módulo para uso pela Dark Factory.
 */

if (typeof window !== "undefined") {
  window.DarkFactoryValidator = DarkFactoryValidator;
}
