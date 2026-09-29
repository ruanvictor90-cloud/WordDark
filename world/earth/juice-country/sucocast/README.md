# SucoCast — Estado SC-001

Primeiro Estado operacional do Juice Country.

## Hierarquia

```
TERRA
└── JUICE COUNTRY
    └── SUCOCAST
        ├── Identidade
        ├── Administração
        ├── Conteúdo
        ├── Produção
        ├── Distribuição
        ├── Inteligência
        ├── Segurança
        └── Rodovia
             └── Dark Factory
```

## Regra do Estado

O SucoCast possui identidade, estado operacional, setores e operações próprios.

A **Dark Factory não pertence ao Estado**. Ela é um executor externo acessado pela Rodovia.

Fluxo:

```
SucoCast
   ↓
Rodovia
   ↓
Dark Factory
   ↓
Rodovia
   ↓
SucoCast
```

## Versão

**SC-0.2**

Esta versão estrutura o Estado em **Setores → Operações** sem transformar cada operação em uma automação real ainda.

A implementação das operações deve acontecer individualmente, com autorização, registro e testes próprios.

## Setores atuais

- **Administração** — entrada, autorização e registro.
- **Conteúdo** — pauta e preparação.
- **Produção** — solicitação, recebimento e validação de material.
- **Distribuição** — preparação e registro de publicação.
- **Inteligência** — métricas e aprendizado.
- **Segurança** — identidade e auditoria.

## Próxima regra

Primeiro consolidar o núcleo do Estado. Depois ativar as operações uma por uma.

Não replicar esta estrutura para os demais Estados antes de validar o modelo no SucoCast.
