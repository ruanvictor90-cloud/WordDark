# WordDark — Sistema de Bibliotecas

A arquitetura de bibliotecas do WordDark possui dois níveis:

- **Biblioteca Local** — memória viva de cada unidade.
- **Biblioteca Central** — arquivo histórico permanente do mundo.

## Regra principal

> A biblioteca local pode mudar. A Biblioteca Central preserva.

### Biblioteca Local

Cada cidade, ilha, estado, país, fábrica ou outro módulo pode possuir sua própria biblioteca local.

Ela guarda:
- operação cotidiana;
- conhecimento de trabalho;
- aprendizados;
- procedimentos;
- versões atuais;
- contexto local;
- resultados e referências úteis.

O conteúdo local pode ser atualizado, substituído ou reorganizado.

### Biblioteca Central

A Biblioteca Central pertence à camada aérea do WordDark.

Ela preserva:
- ideias;
- testes;
- erros;
- soluções;
- versões;
- descobertas;
- decisões arquiteturais;
- operações relevantes;
- aprendizados enviados pelas unidades.

Conteúdo registrado nela não deve ser apagado para "limpar" o histórico.

## Fluxo

```
UNIDADE
  ↓
BIBLIOTECA LOCAL
  ↓
REGISTRO / APRENDIZADO
  ↓
BIBLIOTECA CENTRAL
```

A biblioteca **não decide operações**. Ela registra e preserva conhecimento.

## Separação

- Local = memória operacional viva.
- Central = memória histórica permanente.
- Registry = rastreamento de operações e eventos.
- Security = autorização.
- Router/Rodovia = transporte.
- Executor = execução.

Nenhuma biblioteca deve assumir a responsabilidade de outro módulo.
