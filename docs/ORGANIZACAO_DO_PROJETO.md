# Organização do Projeto — Loteria Premium

## Classificação no GitHub

**Categoria:** Produto web simples / utilitário digital  
**Status:** Projeto em desenvolvimento  
**Prioridade:** Média  
**Nome atual:** `Gerador-Premium-de-Loteria---Sistema-Seguro`  
**Nome recomendado:** `loteria-premium`  
**Visibilidade atual:** Público

## Objetivo central

O Loteria Premium deve ser tratado como um produto digital simples para geração, organização e impressão de combinações de jogos de loteria.

O sistema deve deixar claro que gera combinações e estatísticas para organização de apostas, sem prometer prêmio, acerto ou vantagem matemática.

## Organização sugerida do repositório

```txt
src/
  core/              # Lógica de geração de jogos
  components/        # Componentes visuais
  pages/             # Telas do sistema
  services/          # Exportação, impressão e histórico
  utils/             # Funções auxiliares
  styles/            # Estilos globais

docs/
  ORGANIZACAO_DO_PROJETO.md
  ROADMAP.md
  REGRAS_DE_USO.md
```

Caso o projeto esteja em HTML, CSS e JavaScript puro:

```txt
index.html
assets/
  css/
  js/
  images/
docs/
  ORGANIZACAO_DO_PROJETO.md
```

## Módulos do projeto

### 1. Geração de jogos
Responsável por criar combinações conforme modalidade, dezenas e quantidade desejada.

### 2. Estatísticas simples
Exibição de soma, pares/ímpares, distribuição e resumo básico dos jogos gerados.

### 3. Impressão e PDF
Área para imprimir jogos ou salvar em PDF.

### 4. Exportação
Evolução futura para exportação em Excel, CSV ou PDF organizado.

### 5. Histórico local
Possibilidade futura de salvar jogos gerados no navegador do usuário.

### 6. White-label
Possibilidade comercial para lotéricas, influenciadores ou vendedores de produtos digitais.

## Regras de organização

- Não prometer ganho, prêmio ou acerto.
- Manter aviso claro sobre aleatoriedade dos sorteios.
- Separar lógica de geração da parte visual.
- Manter layout simples, rápido e responsivo.
- Documentar qualquer regra matemática usada.
- Evitar nomes de arquivos confusos ou genéricos.

## Prioridades técnicas

1. Renomear o repositório para `loteria-premium`.
2. Separar lógica, layout e impressão.
3. Criar exportação em PDF.
4. Criar exportação em Excel ou CSV.
5. Criar histórico local dos jogos.
6. Melhorar aviso de uso responsável.
7. Avaliar versão white-label.

## Próxima evolução recomendada

Criar os arquivos:

- `docs/ROADMAP.md`
- `docs/REGRAS_DE_USO.md`

Esses arquivos deixam o projeto mais profissional e reduzem risco de comunicação inadequada sobre apostas.