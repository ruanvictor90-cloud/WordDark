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

## Central de Testes e Diagnóstico

O Núcleo de Operações também possui a responsabilidade de organizar diagnósticos operacionais. Um diagnóstico pode verificar etapas como identidade, autorização, ambiente, rota, comunicação, execução e validação, apresentando cada componente como ONLINE, FAILED, NOT_TESTED ou UNKNOWN.

Quando uma falha é encontrada, o diagnóstico preserva evidências e identifica o ponto afetado. O Learning Engine pode transformar a falha em um **conhecimento candidato** do tipo ERROR_CORRECTION.

Fluxo de aprendizado:

~~~
TESTE
  ↓
DIAGNÓSTICO
  ↓
FALHA + EVIDÊNCIAS
  ↓
CONHECIMENTO CANDIDATO
  ↓
INVESTIGAÇÃO / CORREÇÃO
  ↓
VALIDAÇÃO
  ↓
BIBLIOTECA CENTRAL
~~~

Regra: **o mundo aprende com erros, mas nenhum erro é promovido automaticamente como verdade.** O aprendizado precisa ser investigado, corrigido e validado antes de entrar no conhecimento permanente do WordDark.
