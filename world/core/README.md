# WordDark — Operation MVP

Este diretório contém o primeiro circuito operacional global do WordDark.

## Fluxo

```
IDENTIDADE
   ↓
ACESSO
   ↓
OPERAÇÃO
   ↓
ROTA
   ↓
EXECUÇÃO
   ↓
VALIDAÇÃO
   ↓
RESULTADO
   ↓
REGISTRO
```

A operação é o envelope lógico do trabalho. Ela não substitui os módulos especializados.

- **Identity/Access** decide quem é e o que pode.
- **Operation** registra o trabalho e seu ciclo de vida.
- **Routing/Rodovia** transporta.
- **Dark Factory** executa serviços que pertencem ao Céu.
- **Terra** continua dona da necessidade e da decisão de negócio.
- **Library/Registry** preserva o histórico.

## Primeiro circuito

O `operation-engine.js` é propositalmente pequeno. Ele recebe implementações externas para autorização, rota, execução e registro.

Isso permite testar o circuito antes de acoplar todas as estruturas definitivas do WordDark.

## Estados

`CREATED → IDENTIFIED → AUTHORIZED → ROUTED → EXECUTING → VALIDATING → COMPLETED`

Terminais:

`REJECTED | BLOCKED | FAILED | CANCELLED`

O contrato impede saltos arbitrários entre estados.
