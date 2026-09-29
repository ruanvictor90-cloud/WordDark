# Juice Country

O Juice Country é um país interno do WordDark, localizado na Terra.

Ele será o primeiro exemplo concreto de uma estrutura do WordDark que pode gerar necessidades, solicitar serviços à Dark Factory e receber resultados rastreáveis.

## Identidade

Cada unidade do país deverá ter uma identidade própria. O nome visível identifica a unidade para as pessoas; um identificador estável será usado nas comunicações entre sistemas.

## Organização territorial

JUICE COUNTRY
- Estados / canais
  - Setores / bairros
    - Operações
    - Solicitações
    - Recursos locais

## Estados iniciais planejados

- SucoCast
- SucoGeek
- SucoComed
- SucoFactor

A lista é expansível. Estes nomes definem a estrutura planejada; não significam que todos os canais já estejam implementados.

## Relação com a Dark Factory

Uma unidade poderá enviar uma solicitação com origem, destino, tipo de tarefa e identidade. A Dark Factory deverá validar a solicitação, verificar autorização, selecionar um executor, registrar a execução e devolver o resultado pela Rodovia.

O país não deverá acessar diretamente os componentes internos da fábrica.

## Princípios

- Cada estado mantém sua identidade.
- Setores podem crescer separadamente.
- Unidades reutilizam contratos comuns.
- Registrar uma unidade não significa autorizá-la.
- Memória e dados locais devem ser separados do núcleo da fábrica.
- Novas unidades não devem exigir reconstrução do sistema.
- A estrutura será documentada antes da automação.

## Etapas de construção

1. Finalizar a arquitetura do país.
2. Definir o modelo comum de estado e setor.
3. Criar o primeiro estado de referência.
4. Definir como uma unidade solicita um serviço.
5. Testar o percurso completo com a Dark Factory.
6. Expandir para os demais estados.

## Regra fundamental

O Juice Country deve ser um exemplo real de uso da arquitetura, mas sua construção será gradual. Primeiro estrutura e contratos; depois comportamento; por último automação e escala.
