const { WordDarkKnowledgeRecord } = typeof module !== "undefined" && module.exports
  ? require("../contracts/knowledge.js")
  : window.WordDarkKnowledge;

const firstArchitecturalDecision = new WordDarkKnowledgeRecord({
  knowledgeId: "WD-K-ARCH-001",
  type: WordDarkKnowledgeRecord.TYPES.ARCHITECTURE_DECISION,
  title: "Separação de responsabilidades entre Céu e Terra",
  summary:
    "Céu fornece infraestrutura e serviços compartilhados ao mundo. Terra cria necessidades, define regras de negócio e decide o destino e a distribuição de seus resultados. A Dark Factory pertence ao Céu e atua como serviço de produção: recebe requerimentos autorizados, cria, edita, processa e valida conteúdo, mas não escolhe onde esse conteúdo será publicado. A Biblioteca Central preserva conhecimento e histórico sem assumir decisões operacionais.",
  sourceId: "world/architecture",
  sourceType: "ARCHITECTURE",
  status: WordDarkKnowledgeRecord.STATUS.VALIDATED,
  version: "1.0.0",
  tags: [
    "ceu",
    "terra",
    "dark-factory",
    "responsibility",
    "production",
    "distribution",
    "central-library"
  ],
  evidence: [
    "world/README.md",
    "world/architecture/OPERATION.md",
    "docs/DEVELOPERS.md",
    "world/sky/darkfactory/README.md",
    "world/earth/juice-country/sucocast/README.md"
  ],
  createdAt: "2026-09-28T00:55:00-03:00",
  validatedAt: "2026-09-28T00:55:00-03:00",
  metadata: {
    decision: "production_vs_distribution",
    rule: "A Fábrica produz. O País/Estado decide o que precisa e para onde vai.",
    scope: "WORDDARK",
    establishedAt: "2026-09-28T00:55:00-03:00"
  }
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = { firstArchitecturalDecision };
} else {
  window.WordDarkInitialKnowledge = { firstArchitecturalDecision };
}
