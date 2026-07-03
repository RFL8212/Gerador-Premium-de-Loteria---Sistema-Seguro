# Orientações para Codex e agentes de IA

Este arquivo orienta qualquer agente de IA que trabalhe neste repositório.

## Nome do projeto

Loteria Premium

Nome de repositório recomendado:

```txt
loteria-premium
```

## Finalidade

Sistema web para geração de combinações de jogos de loteria, com recursos de visualização, estatísticas simples e impressão.

## Regra central

Este sistema não deve prometer ganho, acerto, probabilidade superior ou qualquer garantia de prêmio.

A comunicação deve ser responsável: o sistema apenas organiza e gera combinações.

## Prioridades de desenvolvimento

1. Manter a aplicação simples e fácil de usar.
2. Separar lógica de geração de jogos da interface visual.
3. Manter os valores e modalidades atualizados quando necessário.
4. Melhorar impressão e exportação.
5. Criar estrutura clara para futuras versões comerciais.

## Regras técnicas

- Evitar duplicação de funções.
- Nomear funções de forma clara.
- Separar CSS, JavaScript e HTML sempre que possível.
- Manter o código legível para manutenção futura.
- Validar entradas do usuário.
- Não permitir geração com valores inválidos.
- Preservar responsividade.
- Testar em desktop e celular.

## Módulos esperados

- Seleção de modalidade
- Configuração de dezenas
- Configuração de quantidade de jogos
- Geração de combinações
- Cálculo de valores
- Estatísticas simples
- Impressão
- Exportação futura

## O que evitar

- Promessas de resultado financeiro.
- Texto comercial agressivo dizendo que aumenta chance de ganhar.
- Código espalhado sem organização.
- Funções grandes demais.
- Valores fixos sem comentário explicativo.
- Alterações visuais que prejudiquem a leitura dos jogos.

## Padrão de commits

Usar mensagens claras:

```txt
feat: adicionar exportação em PDF
fix: corrigir cálculo de valor total
docs: atualizar instruções do projeto
refactor: separar lógica de geração de jogos
```

## Direção correta

O projeto deve evoluir como uma ferramenta simples, segura e comercialmente apresentável para geração e organização de jogos, sem criar expectativas enganosas sobre sorteios.
