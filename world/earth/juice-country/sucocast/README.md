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

## Núcleo reutilizável

A partir de **SC-0.3**, o Estado passa a separar:

- **Núcleo** — identidade, configuração, operações, registros e integrações.
- **Setores** — organização funcional do Estado.
- **Integrações** — adaptadores para aplicações externas.
- **Rodovia** — comunicação com serviços do WordDark, como a Dark Factory.

O núcleo não depende de uma plataforma específica. Isso permite que o mesmo Estado seja usado dentro da estrutura WordDark e, futuramente, através de integrações externas autorizadas.

## YouTube

Foi criado o primeiro adaptador de contrato para YouTube.

Fluxo previsto:

```
SucoCast
→ autorização
→ operação
→ adaptador YouTube
→ publicação
→ confirmação
→ registro
```

A implementação atual é **somente simulação**. Nenhuma chamada real ao YouTube é feita e nenhuma credencial fica no repositório público.

Capacidades serão tratadas individualmente, por exemplo:

- `youtube.read`
- `youtube.upload`
- `youtube.publish`

A integração real dependerá posteriormente de uma camada segura para credenciais e execução externa.

