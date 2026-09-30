# WordDark — Development Lab

Esta pasta pertence à linha experimental `dev/worddark-lab`.

## Regra de isolamento

- `main` continua sendo a linha operacional.
- Este branch parte de um snapshot de `main`.
- Novas estruturas e protótipos podem evoluir aqui sem alterar o código operacional.
- Nada desta linha entra em `main` automaticamente.
- A integração futura será feita por revisão e merge seletivo.

## Objetivo desta linha

Desenvolver, testar e validar as próximas fundações do WordDark:

1. contexto de execução;
2. pacote de operação;
3. portões;
4. contratos de passagem entre setores;
5. testes de integração antes do transplante para o núcleo operacional.

O laboratório não substitui o código atual enquanto a nova estrutura não estiver validada.
