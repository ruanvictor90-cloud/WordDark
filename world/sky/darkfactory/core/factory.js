/*
 * Dark Factory — Factory Core
 * DF-0.5
 *
 * O núcleo coordena validação, autorização, seleção de executor
 * e execução. O conteúdo específico permanece em executores modulares.
 */

class DarkFactory {
  constructor() {
    this.name = "Dark Factory";
    this.version = "DF-0.5";
    this.status = "ONLINE";
    this.logger = new DarkFactoryLogger();
    this.executorManager = new DarkFactoryExecutorManager();
    this.registerDefaultExecutors();
  }

  registerDefaultExecutors() {
    this.executorManager.register(new DarkFactoryExecutor());
    if (typeof DarkFactoryContentExecutor !== "undefined") {
      this.executorManager.register(new DarkFactoryContentExecutor());
    }
  }

  registerExecutor(executor) {
    return this.executorManager.register(executor);
  }

  process(request) {
    this.logger.log({
      requestId: request ? request.id : null,
      event: "REQUEST_RECEIVED",
      message: "Solicitação recebida pela Dark Factory."
    });

    const validation = DarkFactoryValidator.validateRequest(request);
    if (!validation.valid) {
      this.logger.log({
        requestId: request ? request.id : null,
        event: "VALIDATION_FAILED",
        message: "Solicitação rejeitada durante a validação.",
        data: validation.errors
      });
      return { success:false, status:"REJEITADO", stage:"VALIDAÇÃO", errors:validation.errors };
    }

    const authorization = DarkFactoryValidator.canExecute(request);
    if (!authorization.allowed) {
      this.logger.log({
        requestId: request.id,
        event: "AUTHORIZATION_FAILED",
        message: authorization.reason
      });
      return { success:false, status:"REJEITADO", stage:"AUTORIZAÇÃO", reason:authorization.reason };
    }

    const selection = this.executorManager.select(request);
    if (!selection.success) {
      this.logger.log({
        requestId: request.id,
        event: "EXECUTOR_NOT_FOUND",
        message: selection.reason,
        data: { taskType:request.taskType }
      });
      return {
        success:false,
        status:"REJEITADO",
        stage:"EXECUTOR",
        reason:selection.reason,
        taskType:request.taskType
      };
    }

    const executor = selection.executor;
    this.logger.log({
      requestId: request.id,
      event: "EXECUTOR_SELECTED",
      message: "Executor selecionado.",
      data: { taskType:request.taskType, executor:executor.name }
    });

    this.logger.log({
      requestId: request.id,
      event: "EXECUTION_STARTED",
      message: "Execução iniciada."
    });

    const result = executor.execute(request);

    this.logger.log({
      requestId: request.id,
      event: "EXECUTION_FINISHED",
      message: result.message,
      data: result
    });

    return {
      success:result.success,
      status:result.status,
      requestId:request.id,
      executor:result.executor,
      executorType:result.executorType || request.taskType,
      taskType:result.taskType || request.taskType,
      message:result.message,
      executedAt:result.executedAt,
      batchId:result.batchId || null,
      requestedIntegrations:result.requestedIntegrations || [],
      confirmedCount:result.confirmedCount || 0,
      failedCount:result.failedCount || 0
    };
  }

  getStatus() {
    return {
      name:this.name,
      version:this.version,
      status:this.status,
      executors:this.executorManager.list()
    };
  }

  getExecutors() { return this.executorManager.list(); }
  getLogs() { return this.logger.getAll(); }
  getRequestLogs(requestId) { return this.logger.getByRequest(requestId); }
  clearLogs() { this.logger.clear(); }
}

if (typeof window !== "undefined") window.DarkFactory = DarkFactory;
