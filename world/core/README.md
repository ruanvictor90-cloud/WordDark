# WordDark — Operation MVP

O primeiro circuito operacional global do WordDark.

## Fluxo
IDENTIDADE → ACESSO → OPERAÇÃO → ROTA → EXECUÇÃO → VALIDAÇÃO → RESULTADO → REGISTRO

## Segurança
O Operation Engine recebe uma função authorize. O próximo acoplamento usa o WordDark Security Manager para que essa função deixe de ser demonstrativa.

## Estados
CREATED → IDENTIFIED → AUTHORIZED → ROUTED → EXECUTING → VALIDATING → COMPLETED

Terminais: REJECTED | BLOCKED | FAILED | CANCELLED

O contrato impede saltos arbitrários entre estados.