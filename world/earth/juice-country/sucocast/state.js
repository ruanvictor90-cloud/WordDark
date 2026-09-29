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

    this.core = new SucoCastCore({
      identity: this.identity,
      version: "SC-CORE-0.1",
      configuration: {
        externalOperations: true,
        credentialProvider: "FUTURE_SECURE_BACKEND"
      }
    });

    this.permissionManager = new SucoCastPermissionManager();
    this.eventLog = new SucoCastEventLog();
    this.integrationManager = new SucoCastIntegrationManager();
    this.youtubeAdapter = new SucoCastYouTubeAdapter();
    this.instagramAdapter = new SucoCastInstagramAdapter();
    this.tiktokAdapter = new SucoCastTikTokAdapter();
    this.websiteAdapter = new SucoCastWebsiteAdapter();
    this.externalAppAdapter = new SucoCastExternalAppAdapter();

    this.integrationManager.register(this.youtubeAdapter);
    this.integrationManager.register(this.instagramAdapter);
    this.integrationManager.register(this.tiktokAdapter);
    this.integrationManager.register(this.websiteAdapter);
    this.integrationManager.register(this.externalAppAdapter);

    this.core.registerIntegration(this.youtubeAdapter);
    this.core.registerIntegration(this.instagramAdapter);
    this.core.registerIntegration(this.tiktokAdapter);
    this.core.registerIntegration(this.websiteAdapter);
    this.core.registerIntegration(this.externalAppAdapter);
    this.registerCoreOperations();

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


  registerCoreOperations() {
    this.core.registerOperation({
      operationId: "SC-OP-DIS-003",
      name: "Publicar vídeo no YouTube",
      sectorId: "SC-SEC-DIS",
      capability: "content.publish",
      action: "publish",
      status: "REGISTERED"
    });

    this.core.registerOperation({
      operationId: "SC-OP-DIS-004",
      name: "Registrar resultado de publicação",
      sectorId: "SC-SEC-DIS",
      capability: "publication.record",
      action: "record",
      status: "REGISTERED"
    });
  }

  simulateYouTubePublication(content) {
    const capability = "content.publish";
    const actor = this.identity.identityId;

    this.eventLog.add("EXTERNAL_OPERATION_REQUESTED", {
      actor: actor,
      operationId: "SC-OP-DIS-003",
      platform: "YouTube"
    });

    if (!this.permissionManager.can(actor, capability)) {
      this.eventLog.add("EXTERNAL_OPERATION_REJECTED", {
        actor: actor,
        capability: capability
      });
      return {
        success: false,
        status: "REJECTED",
        reason: "Capacidade não autorizada: " + capability
      };
    }

    const result = this.integrationManager.execute(
      "SC-INTEGRATION-YOUTUBE",
      "publish",
      content
    );

    this.eventLog.add(
      result.success ? "EXTERNAL_OPERATION_CONFIRMED" : "EXTERNAL_OPERATION_FAILED",
      {
        actor: actor,
        platform: "YouTube",
        result: result
      }
    );

    return result;
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
