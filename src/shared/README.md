# Arquitetura do Shared

`src/shared` e a camada de primitivas realmente compartilhadas da aplicacao.

Ela nao existe para agrupar "coisas usadas em varios lugares". Ela existe apenas para concentrar componentes, tipos e utilitarios que sejam agnosticos de dominio e de camada.

## Objetivo do `shared`

O `shared` existe para guardar blocos reutilizaveis que possam ser usados em qualquer parte da aplicacao sem carregar regra de negocio, estado global ou dependencia de infraestrutura.

Na pratica, essa camada deve conter apenas:

- componentes visuais genericos
- tipos neutros e reutilizaveis
- utilitarios puros e agnosticos

## Regras de fronteira

- `shared` nao deve depender de `src/app`
- `shared` nao deve depender de `src/core`
- `shared` nao deve depender de `src/modules`
- `shared` nao deve depender de `src/shell`
- `shared` nao deve depender de `react-router`
- `shared` nao deve conter regra de permissao, sessao, tenant, navegacao ou layout

Regra pratica:

- se um arquivo precisa importar `@/core/*`, `@/app/*`, `@/modules/*`, `@/shell/*` ou `react-router`, ele provavelmente nao pertence ao `shared`

## Estrutura atual

Hoje `src/shared` contem apenas este README.

Novas implementacoes so devem entrar aqui se forem realmente neutras.

## O que pode entrar em `shared`

Exemplos corretos:

- `components/loading-spinner.tsx`
- `components/empty-state.tsx`
- `components/section-title.tsx`
- `components/data-badge.tsx`
- `types/pagination.types.ts`
- `types/select-option.types.ts`
- `utils/string.utils.ts`
- `utils/date.utils.ts`
- `utils/number.utils.ts`

Caracteristicas desses exemplos:

- nao sabem nada sobre sessao
- nao sabem nada sobre permissao
- nao sabem nada sobre tenant
- nao sabem nada sobre router
- nao sabem nada sobre modulos de negocio

## O que nao pode entrar em `shared`

Exemplos incorretos:

- `AuthGuard`
- `PermissionGuard`
- `RouteMetadata`
- `RoutingProgress`
- `ThemeToggle`
- paginas `403`, `404` ou erro de rota
- componente `<Can />` se ele depender de permissao do `core`

Motivo:

- guards pertencem ao `app/routing`
- metadata de rota pertence ao `app`
- progresso de navegacao pertence ao `app`
- toggle de tema pertence ao `shell` ou `core/theme`
- paginas de erro de rota pertencem ao `app`
- controle de permissao depende do `core`

## Estado atual da camada

No estado atual do projeto, `shared` esta reservado e vazio por escolha arquitetural.

Isso e melhor do que manter uma camada ambigua cheia de artefatos fora do lugar.

Se um novo codigo nao for claramente neutro, ele nao deve entrar aqui.

## Diretriz de manutencao

Antes de adicionar qualquer arquivo em `src/shared`, valide estas perguntas:

1. Esse arquivo funciona sem importar `core`, `app`, `modules`, `shell` ou `react-router`?
2. Esse arquivo continua fazendo sentido fora do contexto atual de negocio?
3. Esse arquivo e uma primitiva reutilizavel, e nao uma integracao?

Se qualquer resposta for "nao", o arquivo provavelmente pertence a outra camada.

Resumo da regra:

- `shared` e para primitivas neutras
- se depende do contexto da aplicacao, nao e `shared`
