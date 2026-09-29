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

## 5. Blocos 18–22 — fechamento estrutural MVP

Os cinco blocos abaixo foram implementados:

18. **Registro formal da validação** — `world/architecture/VALIDATION-001.md` registra o primeiro circuito integrado validado.
19. **Consolidação dos testes** — workflow do GitHub Actions inclui os testes estruturais e os novos contratos de persistência, ACK e erro.
20. **Persistência substituível** — `world/core/persistence.js` fornece armazenamento em memória com contrato simples, preparado para futura implementação persistente.
21. **ACK explícito** — `world/contracts/ack.js` separa confirmação de recebimento de conclusão da operação.
22. **Erro padronizado** — `world/contracts/error.js` define código, estágio, mensagem, possibilidade de retry e detalhes.

Esses componentes ainda são MVP/TEST. Não representam banco de produção, mensageria assíncrona ou observabilidade de produção.

## 6. Próxima sequência de concretagem
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


## Bloco 23 — Security Hardening

O hardening inicial fecha quatro barreiras estruturais antes da expansão dos módulos:

1. **Acesso validado**
   - identity + capability + action + environment + scope;
   - datas de concessão/expiração precisam ser válidas;
   - permissões expiradas deixam de autorizar operações.

2. **Ambiente**
   - TEST e PROD permanecem separados;
   - ambientes bloqueados impedem execução;
   - PROD exige uma aprovação separada da autorização normal da operação.

3. **Identidade e auditoria**
   - identidade duplicada não pode ser registrada novamente;
   - ambiente inválido é rejeitado;
   - toda decisão de autorização continua gerando auditoria.

4. **Proteção contra replay**
   - uma operação concluída não pode ser executada novamente pelo mesmo engine;
   - o segundo processamento é registrado como tentativa bloqueada, sem chamar o executor novamente.

### Regra de segurança do MVP

> Nenhum módulo deve contornar identidade, acesso, ambiente, autorização ou auditoria para executar uma operação.

### Limite atual

Este bloco fortalece o núcleo lógico do MVP. Ainda não equivale a segurança de produção: autenticação externa, gestão de segredos, banco persistente, isolamento de processos, criptografia em trânsito/repouso e observabilidade operacional continuam como etapas posteriores.
