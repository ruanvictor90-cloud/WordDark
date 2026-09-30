# WordDark — Modelo oficial de branches

## As três linhas oficiais

| Branch | Função | Regra |
|---|---|---|
| `main` | 🌍 Mundo online / produção | Recebe somente mudanças validadas |
| `develop` | 🛠️ Criação / desenvolvimento | Área livre para construir e modificar |
| `staging` | 🧪 Teste / integração | Junta mudanças e valida antes da promoção |

## Fluxo oficial

`develop → staging → main`

### main
É a linha de referência do mundo. Deve permanecer estável. Depois que o WordDark entrar em operação, alterações diretas devem ser evitadas.

### develop
É a oficina de criação. Novas cidades, módulos, interfaces e experimentos de desenvolvimento entram primeiro aqui.

### staging
É a área de união. Recebe mudanças que precisam ser integradas e testadas em conjunto antes de chegarem ao mundo online.

## Regra estrutural

> Um galho pode depender do tronco, mas não deve quebrar o tronco para crescer.

Cada branch pode evoluir seu trabalho sem transformar desenvolvimento experimental em alteração direta da linha principal.

## Estado desta reorganização

- `main`: núcleo funcional preservado.
- `develop`: linha de criação recebeu o módulo Cidade Compras.
- `staging`: linha de integração recebeu o conjunto WordDark Core V1 selecionado.
- Branches antigas `dev/*`: mantidas temporariamente apenas até conferência/limpeza manual.

## Observação

Este documento descreve o processo de desenvolvimento. Ele não é uma dependência de runtime do WordDark.
