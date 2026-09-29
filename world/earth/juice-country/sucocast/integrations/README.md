# SucoCast — Integrações

Esta camada conecta o núcleo do Estado a aplicações externas.

Regra:

```
NÚCLEO DO ESTADO
       ↓
GERENCIADOR DE INTEGRAÇÕES
       ↓
ADAPTADOR DA PLATAFORMA
       ↓
APLICAÇÃO EXTERNA
```

Cada plataforma terá um adaptador próprio.

Exemplos futuros:

- YouTube
- Instagram
- outras plataformas autorizadas

As credenciais reais **não ficam no frontend nem neste repositório público**. A primeira implementação usa um adaptador de teste para validar o contrato de publicação antes de qualquer integração real.
