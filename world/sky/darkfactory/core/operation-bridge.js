/* WordDark — Dark Factory Operation Bridge */
class DarkFactoryOperationBridge {
  constructor({ factory, router, serviceMap = {} } = {}) {
    this.factory = factory || null;
    this.router = router || null;
    this.serviceMap = serviceMap;
  }

  getService(operation) {
    return this.serviceMap[operation.operationType] || operation.operationType;
  }

  createRequest(operation) {
    return new DarkFactoryRequest({
      requester: operation.requesterId,
      origin: operation.originId,
      destination: operation.destinationId || "world/sky/darkfactory",
      task: operation.payload.task || ("Executar operação " + operation.operationType),
      taskType: this.getService(operation),
      permission: "approved",
      payload: operation.payload
    });
  }

  route(operation) {
    if (!this.router) return { success:false, reason:"Rodovia não configurada." };
    const request = this.createRequest(operation);
    return this.router.send({
      envelope:{
        messageId:"OPMSG-" + operation.operationId,
        requestId:operation.operationId,
        type:"OPERATION_REQUEST",
        payload:request.toJSON()
      },
      origin:operation.originId,
      destination:operation.destinationId || "world/sky/darkfactory",
      service:this.getService(operation)
    });
  }

  execute(operation) {
    if (!this.factory) return { success:false, reason:"Dark Factory não configurada." };
    const result = this.factory.process(this.createRequest(operation));
    return {
      success:result.success === true,
      validated:result.success === true,
      result,
      message:result.message || result.status || "Execução concluída.",
      reason:result.reason || null
    };
  }
}
if (typeof module !== "undefined") module.exports = DarkFactoryOperationBridge;
if (typeof window !== "undefined") window.DarkFactoryOperationBridge = DarkFactoryOperationBridge;
