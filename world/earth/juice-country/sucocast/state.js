/*
 * WordDark — SucoCast State
 * Estado SC-001
 *
 * Estrutura operacional:
 * Estado → Setores → Operações
 *
 * O Estado organiza sua própria estrutura.
 * A Dark Factory continua sendo um executor externo.
 */

class SucoCastState {
  constructor(identity) {
    this.identity = identity;
    this.status = "ONLINE";
    this.version = "SC-0.2";
    this.parentId = "world/earth/juice-country";

    this.road = {
      outbound: "ROUTE-SUCOCAST-DARKFACTORY",
      inbound: "ROUTE-DARKFACTORY-SUCOCAST"
    };

    this.sectors = [
      {
        sectorId: "SC-SEC-ADM",
        name: "Administração",
        status: "ONLINE",
        operations: [
          { operationId: "SC-OP-ADM-001", name: "Receber solicitação", status: "READY" },
          { operationId: "SC-OP-ADM-002", name: "Autorizar operação", status: "READY" },
          { operationId: "SC-OP-ADM-003", name: "Registrar resultado", status: "READY" }
        ]
      },
      {
        sectorId: "SC-SEC-CON",
        name: "Conteúdo",
        status: "ONLINE",
        operations: [
          { operationId: "SC-OP-CON-001", name: "Definir pauta", status: "READY" },
          { operationId: "SC-OP-CON-002", name: "Preparar conteúdo", status: "READY" }
        ]
      },
      {
        sectorId: "SC-SEC-PRO",
        name: "Produção",
        status: "ONLINE",
        operations: [
          { operationId: "SC-OP-PRO-001", name: "Solicitar produção", status: "READY" },
          { operationId: "SC-OP-PRO-002", name: "Receber material", status: "READY" },
          { operationId: "SC-OP-PRO-003", name: "Validar material", status: "READY" }
        ]
      },
      {
        sectorId: "SC-SEC-DIS",
        name: "Distribuição",
        status: "ONLINE",
        operations: [
          { operationId: "SC-OP-DIS-001", name: "Preparar publicação", status: "READY" },
          { operationId: "SC-OP-DIS-002", name: "Registrar publicação", status: "READY" }
        ]
      },
      {
        sectorId: "SC-SEC-INT",
        name: "Inteligência",
        status: "ONLINE",
        operations: [
          { operationId: "SC-OP-INT-001", name: "Registrar métricas", status: "READY" },
          { operationId: "SC-OP-INT-002", name: "Gerar aprendizado", status: "READY" }
        ]
      },
      {
        sectorId: "SC-SEC-SEG",
        name: "Segurança",
        status: "ONLINE",
        operations: [
          { operationId: "SC-OP-SEG-001", name: "Validar identidade", status: "READY" },
          { operationId: "SC-OP-SEG-002", name: "Registrar auditoria", status: "READY" }
        ]
      }
    ];
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

    request.authorize();
    return request;
  }

  getSector(sectorId) {
    return this.sectors.find((sector) => sector.sectorId === sectorId) || null;
  }

  listSectors() {
    return this.sectors.map((sector) => ({
      sectorId: sector.sectorId,
      name: sector.name,
      status: sector.status,
      operationCount: sector.operations.length
    }));
  }

  getOperationCount() {
    return this.sectors.reduce(
      (total, sector) => total + sector.operations.length,
      0
    );
  }

  getStatus() {
    return {
      identityId: this.identity.identityId,
      name: this.identity.name,
      version: this.version,
      status: this.status,
      parentId: this.parentId,
      sectorCount: this.sectors.length,
      operationCount: this.getOperationCount()
    };
  }
}

if (typeof window !== "undefined") {
  window.SucoCastState = SucoCastState;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = SucoCastState;
}
