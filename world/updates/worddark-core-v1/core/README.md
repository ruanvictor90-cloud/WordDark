# WordDark Core V1 — Composition Layer

Este diretório é um laboratório isolado para a próxima composição do Core.

## Regra de integração

O Core consolidado em `world/core` continua sendo a autoridade operacional.

A V1 acrescenta, sem substituição imediata:

- contexto de execução;
- entidades de cliente/canal/projeto/usuário/serviço;
- portões de entrada;
- permissões contextualizadas;
- pacote de operação;
- recuperação de erros;
- inbox acionável;
- versionamento;
- conectores externos;
- composição ponta a ponta.

## Ponte

`composition-bridge.js` é a primeira camada de união.

Fluxo:

V1 Context/Operation
→ Gate V1
→ PermissionSet V1
→ tradução para Global Operation
→ WordDark Operation Engine
→ Road / Executor / Registry / Libraries

A ponte não substitui:

- `world/contracts/operation.js`
- `world/core/operation-engine.js`
- `world/core/world-runtime.js`
- `world/core/road.js`
- `world/core/operation-registry.js`

## Critério de promoção

Nenhum bloco deve ser movido para `world/core` apenas porque funciona isoladamente.

Cada bloco precisa:

1. teste isolado;
2. teste de integração;
3. compatibilidade com o contrato consolidado;
4. ausência de regressão;
5. aprovação explícita para promoção.

Assim, o laboratório pode evoluir sem quebrar o que já foi consolidado.
