/*
 * WordDark — SucoCast State
 * Estado SC-001
 *
 * Responsabilidade:
 * Representar a primeira unidade operacional do Juice Country.
 */

class SucoCastState {
  constructor(identity) {
    this.identity = identity;
    this.status = "ONLINE";
    this.version = "SC-0.1";
  }

  createTestRequest() {
    const request = new DarkFactoryRequest({
      requester: this.identity.identityId,
      origin: "state/sucocast",
      destination: "darkfactory",
      task: "Teste operacional do Estado SucoCast",
      taskType: "test",
      permission: "approved"
    });

    request.authorize("approved");
    return request;
  }

  getStatus() {
    return {
      identityId: this.identity.identityId,
      name: this.identity.name,
      version: this.version,
      status: this.status
    };
  }
}

if (typeof window !== "undefined") {
  window.SucoCastState = SucoCastState;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = SucoCastState;
}