# Arquitetura do Shell

`src/shell` e a camada visual estrutural da aplicacao.

Ela existe para montar o layout principal, distribuir os blocos visuais compartilhados do layout e renderizar a navegacao que o `app` entrega pronta.

## Objetivo do `shell`

O `shell` e responsavel por sustentar a moldura visual da aplicacao.

Na pratica, ele cobre:

- montagem do layout principal em runtime
- variacao entre topbar, sidebar esquerda e sidebar direita
- renderizacao visual da navegacao
- branding do tenant dentro do layout
- busca placeholder, footer e toggle de tema

## Regras de fronteira

- `shell` pode depender de `core` apenas para configuracao visual compartilhada, como tenant e tema
- `shell` nao deve depender de `modules`
- `shell` nao deve decidir regra de negocio, autenticacao, permissao ou metadata de rota
- `shell` recebe a navegacao pronta do `app`
- concerns de roteamento da aplicacao, como progresso de navegacao, ficam em `src/app`

## Estrutura atual

Hoje `src/shell` esta organizado assim:

```text
src/shell/
  layout/
    layout.engine.tsx
    layout.types.ts
    components/
      branding.tsx
      layout-footer.tsx
      navigation-link.tsx
      search-placeholder.tsx
      sidebar.tsx
      theme-toggle.tsx
      topbar.tsx
```

## Mapa por arquivo e pasta

### `layout.engine.tsx`

Responsabilidade:

- ler a configuracao visual do tenant em um unico ponto
- decidir se o layout sera com `topbar`, `sidebar` esquerda ou `sidebar` direita
- repassar props visuais prontas para os componentes de layout
- renderizar `Outlet` e footer estrutural

Esse arquivo e o motor do layout em runtime.

### `layout.types.ts`

Responsabilidade:

- definir os contratos visuais usados internamente pelo shell
- tipar itens de navegacao, branding e props de layout

Tipos principais:

- `LayoutNavigationItem`
- `LayoutBranding`
- `TopbarProps`
- `SidebarProps`
- `LayoutEngineProps`

## `components/`

Responsabilidade:

- concentrar os blocos visuais reutilizados pelo layout

### `topbar.tsx`

Responsabilidade:

- renderizar o cabecalho horizontal do layout
- exibir branding, navegacao, busca e toggle de tema

### `sidebar.tsx`

Responsabilidade:

- renderizar a navegacao lateral
- exibir branding, busca, links e toggle de tema

### `branding.tsx`

Responsabilidade:

- renderizar logo e nome da aplicacao dentro do layout

### `navigation-link.tsx`

Responsabilidade:

- centralizar a regra visual dos links de navegacao
- aplicar estado ativo do `NavLink`

### `search-placeholder.tsx`

Responsabilidade:

- renderizar o placeholder visual de busca do layout

Hoje ele e apenas estrutural, sem comportamento de busca real.

### `layout-footer.tsx`

Responsabilidade:

- renderizar o footer estrutural do layout quando configurado

### `theme-toggle.tsx`

Responsabilidade:

- alternar entre modo claro e escuro
- aplicar a transicao visual do tema

## Fluxo dentro da aplicacao

O fluxo principal do `shell` hoje e:

1. `src/app/root.layout.tsx` resolve os itens de navegacao visiveis
2. `LayoutEngine` recebe esses itens
3. `LayoutEngine` consulta o tenant e decide a variante do layout
4. `Topbar` ou `Sidebar` renderizam a navegacao e os blocos visuais compartilhados

## Diretriz de manutencao

Ao alterar `src/shell`, preserve estas regras:

- mantenha a leitura de configuracao visual concentrada no `LayoutEngine`
- deixe `Topbar` e `Sidebar` como componentes apresentacionais
- extraia duplicacoes visuais para `components/` quando fizer sentido real
- nao coloque concerns de roteamento da aplicacao dentro do `shell`
- nao importe modulos de negocio no `shell`
- trate o `shell` como camada de layout, nao como camada de regra de negocio

Se uma mudanca nova exigir decisao de fluxo, permissao, sessao ou metadata, provavelmente ela pertence ao `app`, nao ao `shell`.
