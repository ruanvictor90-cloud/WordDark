class DarkFactoryCommunication {
  constructor(factory) {
    this.factory = factory;
    this.name = "DF-Communication";
    this.version = "DF-0.2";
    this.status = "ONLINE";
  }

  createEnvelope(request) {
    return {
      protocol: "DF-0.2",
      messageId: this.generateId("MSG"),
      requestId: request ? request.id : null,
      origin: request ? request.origin : null,
      destination: request ? request.destination : null,
      type: "REQUEST",
      createdAt: new Date().toISOString(),
      payload: request ? request.toJSON() : null
    };
  }

  send(request) {
    const envelope = this.createEnvelope(request);

    if (!request) {
      return {
        success: false,
        status: "REJEITADO",
        stage: "COMUNICAÇÃO",
        reason: "Solicitação ausente.",
        envelope: envelope
      };
    }

    const result = this.factory.process(request);

    return {
      success: result.success,
      status: result.status,
      messageId: envelope.messageId,
      requestId: request.id,
      origin: request.origin,
      destination: request.destination,
      result: result
    };
  }

  generateId(prefix) {
    const time = Date.now().toString(36).toUpperCase();
    const random = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();

    return prefix + "-" + time + "-" + random;
  }

  getStatus() {
    return {
      name: this.name,
      version: this.version,
      status: this.status
    };
  }
}


if (typeof window !== "undefined") {
  window.DarkFactoryCommunication =
    DarkFactoryCommunication;
}
