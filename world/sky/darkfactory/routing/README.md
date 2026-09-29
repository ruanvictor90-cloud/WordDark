# Routing

A camada de Routing representa a **Rodovia** da Dark Factory.

Ela será responsável por organizar o caminho das solicitações entre origem, destino e executor.

## Fluxo planejado

ORIGEM
↓
RODOVIA
↓
DARK FACTORY
↓
EXECUTOR
↓
RODOVIA
↓
DESTINO

## Responsabilidades futuras

- identificar origem e destino
- validar rota permitida
- encaminhar solicitações
- preservar o requestId
- preservar o messageId
- registrar passagem
- devolver a resposta para a origem

## Regra

A Rodovia transporta a solicitação. Ela não decide sozinha se a solicitação pode ser executada.
