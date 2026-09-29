# WordDark — Concretagem do Marco Zero

Esta etapa fortalece o esqueleto criado no Marco Zero sem transformar o protótipo em uma falsa infraestrutura de produção.

## 1. Rodovia global
Arquivos:
- `world/contracts/message.js`
- `world/contracts/route.js`
- `world/core/road.js`

Responsabilidades:
- Message = envelope da comunicação.
- Route = caminho permitido.
- Road = transporte e registro da entrega.

A Rodovia não autoriza e não executa.

## 2. TEST / PROD
Arquivos:
- `world/contracts/environment.js`
- `world/core/environment-guard.js`
- integração no `world/core/operation-engine.js`

Regra atual:
- TEST pode executar quando o ambiente está ativo.
- PROD exige um mecanismo explícito de aprovação.
- Sem aprovação configurada, PROD é bloqueado.

Isso é uma barreira arquitetural MVP, não segurança de produção.

## 3. Contas
Arquivos:
- `world/contracts/account.js`
- `world/security/account-manager.js`

Tipos iniciais:
- DEV
- PERSONAL
- SYSTEM

A conta é separada da identidade. O Account Manager controla cadastro e estado da conta, mas não armazena senha, token ou sessão.

## 4. O que continua propositalmente separado
Ainda não implementamos como produção:
- autenticação real;
- banco de dados persistente;
- secrets/credenciais reais;
- publicação real em plataformas;
- cidades completas;
- integração externa real;
- infraestrutura própria do WordDark.

Esses pontos dependem de decisões de infraestrutura e não devem ser simulados como se já fossem seguros.

## 5. Próxima sequência de concretagem
1. integrar a Rodovia global ao Operation Engine;
2. consolidar Registry + Biblioteca Local/Central;
3. transformar promoção de conhecimento em fluxo controlado;
4. estruturar contas DEV/PERSONAL com permissões por operação;
5. separar definitivamente TEST e PROD;
6. criar persistência substituível;
7. fortalecer Dark Factory como executor de serviços;
8. depois construir cidades e integrações reais.

## Princípio
**Primeiro concreto estrutural; depois infraestrutura pesada.**

Cada camada deve continuar substituível sem quebrar as demais.
