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
          { operationId: "SC-OP-DIS-002", name: "Registrar publicação", status: "READY" },
          { operationId: "SC-OP-DIS-003", name: "PUBLICAR_CONTEUDO", status: "READY" }
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
    const publicationIntegrations = [
      "SC-INTEGRATION-YOUTUBE",
      "SC-INTEGRATION-INSTAGRAM",
      "SC-INTEGRATION-TIKTOK",
      "SC-INTEGRATION-WEBSITE",
      "SC-INTEGRATION-EXTERNAL"
    ];

    this.core.registerOperation({
      operationId: "SC-OP-DIS-003",
      name: "PUBLICAR_CONTEUDO",
      sectorId: "SC-SEC-DIS",
      capability: "content.publish",
      action: "publish",
      compatibleIntegrations: publicationIntegrations,
      status: "REGISTERED"
    });

    this.core.registerOperation({
      operationId: "SC-OP-DIS-004",
      name: "REGISTRAR_PUBLICACAO",
      sectorId: "SC-SEC-DIS",
      capability: "publication.record",
      action: "record",
      compatibleIntegrations: [],
      status: "REGISTERED"
    });
  }

  publishContent(integrationId, content) {
    const operationId = "SC-OP-DIS-003";
    const actor = this.identity.identityId;
    const integration = this.core.getIntegration(integrationId);

    this.eventLog.add("CONTENT_PUBLICATION_REQUESTED", {
      actor: actor,
      operationId: operationId,
      integrationId: integrationId
    });

    if (!integration) {
      return {
        success: false,
        status: "FAILED",
        reason: "Integração não encontrada.",
        operationId: operationId,
        integrationId: integrationId
      };
    }

    if (!this.permissionManager.can(actor, "content.publish")) {
      this.eventLog.add("CONTENT_PUBLICATION_REJECTED", {
        actor: actor,
        capability: "content.publish",
        integrationId: integrationId
      });
      return {
        success: false,
        status: "REJECTED",
        reason: "Capacidade não autorizada: content.publish",
        operationId: operationId,
        integrationId: integrationId
      };
    }

    const operation = this.core.getOperation(operationId);
    if (!operation.compatibleIntegrations.includes(integrationId)) {
      return {
        success: false,
        status: "REJECTED",
        reason: "Integração incompatível com PUBLICAR_CONTEUDO.",
        operationId: operationId,
        integrationId: integrationId
      };
    }

    const result = this.integrationManager.execute(
      integrationId,
      operation.action,
      content || {}
    );

    this.eventLog.add(
      result.success ? "CONTENT_PUBLICATION_CONFIRMED" : "CONTENT_PUBLICATION_FAILED",
      {
        actor: actor,
        integrationId: integrationId,
        result: result
      }
    );

    return Object.assign({
      operationId: operationId,
      integrationId: integrationId
    }, result);
  }

  simulateYouTubePublication(content) {
    return this.publishContent("SC-INTEGRATION-YOUTUBE", content);
  }

  requestPublicationThroughFactory(communication, runner, content, integrationIds, actor) {
    if (!communication || !runner) {
      return {
        success:false,
        status:"REJECTED",
        reason:"Communication e OperationRunner são obrigatórios."
      };
    }

    const targets=Array.isArray(integrationIds)
      ? Array.from(new Set(integrationIds))
      : [];

    const request=new DarkFactoryRequest({
      requester:actor || this.identity.identityId,
      origin:"state/sucocast",
      destination:"darkfactory",
      task:"Publicação de conteúdo em múltiplas plataformas",
      taskType:"content.publish",
      permission:"approved",
      payload:{
        contentId:content && content.contentId ? content.contentId : null,
        title:content && content.title ? content.title : null,
        integrationIds:targets,
        body:content && content.body ? content.body : null,
        asset:content && content.asset ? content.asset : null,
        metadata:content && content.metadata ? content.metadata : null
      }
    });

    request.authorize();

    const factoryResponse=communication.send(request);

    if (!factoryResponse.success) {
      this.eventLog.add("FACTORY_PUBLICATION_REJECTED", {
        requestId:request.id,
        result:factoryResponse
      });
      return {
        success:false,
        status:factoryResponse.status || "REJECTED",
        requestId:request.id,
        factoryResponse:factoryResponse,
        publication:null
      };
    }

    const factoryResult=factoryResponse.result || {};
    const publication=runner.run("SC-OP-DIS-003", {
      actor:actor || this.identity.identityId,
      batchId:factoryResult.batchId,
      integrationIds:targets,
      payload:content && typeof content.toJSON === "function"
        ? content.toJSON()
        : (content || {})
    });

    this.eventLog.add(
      publication.success ? "FACTORY_PUBLICATION_DISPATCHED" : "FACTORY_PUBLICATION_DISPATCH_FAILED",
      {
        requestId:request.id,
        batchId:publication.batchId || factoryResult.batchId || null,
        factoryResult:factoryResult,
        publication:publication
      }
    );

    return {
      success:publication.success,
      status:publication.status,
      requestId:request.id,
      requestMessageId:factoryResponse.requestMessageId || null,
      responseMessageId:factoryResponse.responseEnvelope
        ? factoryResponse.responseEnvelope.messageId
        : null,
      batchId:publication.batchId || factoryResult.batchId || null,
      factoryResponse:factoryResponse,
      publication:publication
    };
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
