# Dark Factory

A Dark Factory é uma unidade de execução do **Céu** dentro do WordDark.

Ela existe como infraestrutura compartilhada para atender unidades da **Terra**. Sua função, no domínio de conteúdo, é equivalente a uma ferramenta de criação e edição: recebe um requerimento autorizado, produz/processa/valida o material e devolve o resultado.

## Posição no WordDark

```
WORDDARK
│
├── CÉU
│   └── DARK FACTORY
│       └── Serviço compartilhado de produção
│
└── TERRA
    └── Países / Estados / Marcas / Canais
```

## Regra fundamental de responsabilidade

**A Dark Factory não administra marcas, canais ou redes sociais.**

Ela **não escolhe onde publicar**, **não decide o destino do conteúdo** e **não define a necessidade da Terra**.

Quem gera a necessidade é responsável por definir o requerimento e o destino.

```
🌎 PAÍS / ESTADO
   │
   │ requerimento de conteúdo
   ▼
🚧 RODOVIA
   ▼
🏭 DARK FACTORY · CÉU
   ├── criação
   ├── edição
   ├── processamento
   └── validação
   │
   ▼
🚧 RODOVIA
   ▼
🌎 PAÍS / ESTADO
   ├── recebe o material
   ├── decide o destino
   └── distribui/publica
```

Exemplo: o SucoCast pode pedir **"produza um vídeo sobre X, formato Y, duração Z"**. A Dark Factory não recebe uma lista de YouTube/Instagram/TikTok para decidir distribuição.

## Função principal

```
SOLICITAÇÃO
     ↓
IDENTIFICAÇÃO
     ↓
AUTORIZAÇÃO
     ↓
PLANEJAMENTO
     ↓
CRIAÇÃO / EDIÇÃO
     ↓
PROCESSAMENTO
     ↓
VALIDAÇÃO
     ↓
REGISTRO
     ↓
RESULTADO
```

## Estrutura inicial

DARK FACTORY
│
├── Entrada
├── Identidade
├── Permissões
├── Planejamento
├── Produção
├── Edição
├── Processamento
├── Validação
├── Segurança
├── Logs
└── Resultado

## Princípios

- Modularidade
- Identidade
- Permissões
- Segurança
- Rastreabilidade
- Validação
- Registro
- Retorno de resultados
- Evolução por versões
- Separação entre produção e distribuição

## Solicitações

Toda solicitação recebida pela Dark Factory deverá possuir identificação própria.

Uma solicitação deve permitir determinar:

- Quem solicitou
- Qual é a origem
- Qual é o destino do serviço
- O que precisa ser produzido/editado
- Quais especificações foram fornecidas
- Quais permissões possui
- Qual executor será utilizado
- Qual foi o resultado
- O que aconteceu durante a execução

O **destino de publicação** não faz parte da responsabilidade da fábrica.

## Execução

A Dark Factory não deve executar uma solicitação diretamente sem verificar identidade e autorização.

O fluxo mínimo é:

ENTRADA
  ↓
IDENTIDADE
  ↓
PERMISSÃO
  ↓
REQUERIMENTO
  ↓
EXECUTOR
  ↓
PRODUÇÃO / PROCESSAMENTO
  ↓
VALIDAÇÃO
  ↓
LOG
  ↓
RETORNO

## Escala

A Dark Factory fica no Céu para ser reutilizada por diferentes unidades da Terra.

Novos Estados, marcas, cidades, canais e projetos podem solicitar serviços sem precisar criar sua própria fábrica.

Isso permite que cada unidade da Terra mantenha suas próprias raízes, identidade, estratégia e distribuição.

## Evolução

### DF-0.1
- Entrada de solicitação
- Identificação
- Permissão básica
- Execução controlada
- Resultado
- Registro básico

### DF-0.2
Comunicação entre componentes.

### DF-0.3
Sistema de executores.

### DF-0.4
- Contratos
- Rodovia / Routing
- Registry
- Base de segurança
- Base de armazenamento
- Preparação para múltiplas unidades da Terra

### DF-0.5
Automação e processamento de fluxos.

### DF-0.6
Separação explícita entre **produção de conteúdo no Céu** e **distribuição/publicação na Terra**.

## Regra de arquitetura

> **A Fábrica produz. O País/Estado decide o que precisa e para onde vai.**

A fábrica deve evoluir por expansão, não por assumir responsabilidades que pertencem às unidades da Terra.
