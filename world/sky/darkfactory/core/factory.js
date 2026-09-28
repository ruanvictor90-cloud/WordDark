/*
 * Dark Factory — Factory Core
 * DF-0.1
 *
 * Responsabilidade:
 * Coordenar o fluxo básico de uma solicitação dentro
 * da Dark Factory.
 *
 * Fluxo:
 *
 * ENTRADA
 *   ↓
 * VALIDAÇÃO
 *   ↓
 * AUTORIZAÇÃO
 *   ↓
 * EXECUÇÃO
 *   ↓
 * REGISTRO
 *   ↓
 * RESULTADO
 */

class DarkFactory {

  constructor() {

    this.name = "Dark Factory";

    this.version = "DF-0.1";

    this.status = "ONLINE";

    this.logger = new DarkFactoryLogger();

    this.executor = new DarkFactoryExecutor();
  }


  process(request) {

    /*
     * 1. Entrada
     */

    this.logger.log({
      requestId: request ? request.id : null,
      event: "REQUEST_RECEIVED",
      message: "Solicitação recebida pela Dark Factory."
    });


    /*
     * 2. Validação
     */

    const validation =
      DarkFactoryValidator.validateRequest(request);


    if (!validation.valid) {

      this.logger.log({
        requestId: request ? request.id : null,
        event: "VALIDATION_FAILED",
        message: "Solicitação rejeitada durante a validação.",
        data: validation.errors
      });

      return {
        success: false,
        status: "REJEITADO",
        stage: "VALIDAÇÃO",
        errors: validation.errors
      };
    }


    /*
     * 3. Autorização
     */

    const authorization =
      DarkFactoryValidator.canExecute(request);


    if (!authorization.allowed) {

      this.logger.log({
        requestId: request.id,
        event: "AUTHORIZATION_FAILED",
        message: authorization.reason
      });

      return {
        success: false,
        status: "REJEITADO",
        stage: "AUTORIZAÇÃO",
        reason: authorization.reason
      };
    }


    /*
     * 4. Execução
     */

    this.logger.log({
      requestId: request.id,
      event: "EXECUTION_STARTED",
      message: "Execução iniciada."
    });


    const result =
      this.executor.execute(request);


    /*
     * 5. Registro do resultado
     */

    this.logger.log({
      requestId: request.id,
      event: "EXECUTION_FINISHED",
      message: result.message,
      data: result
    });


    /*
     * 6. Retorno
     */

    return {
      success: result.success,
      status: result.status,
      requestId: request.id,
      executor: result.executor,
      message: result.message,
      executedAt: result.executedAt
    };
  }


  getStatus() {

    return {
      name: this.name,
      version: this.version,
      status: this.status,
      executor: this.executor.getStatus()
    };
  }


  getLogs() {

    return this.logger.getAll();
  }


  getRequestLogs(requestId) {

    return this.logger.getByRequest(requestId);
  }


  clearLogs() {

    this.logger.clear();
  }

}


/*
 * Disponibiliza a fábrica para uso pela interface
 * e por outros módulos do WordDark.
 */

if (typeof window !== "undefined") {
  window.DarkFactory = DarkFactory;
}
