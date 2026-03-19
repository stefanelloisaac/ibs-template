# Arquitetura do App

`src/app` e a camada de composicao da aplicacao.

Ela conecta infraestrutura, roteamento, layout raiz e comportamento global antes dos modulos de negocio assumirem a renderizacao das telas.

## Objetivo do `app`

O `app` existe para montar a aplicacao.

Na pratica, ele e responsavel por:

- iniciar a arvore React no cliente
- compor os providers globais
- registrar o roteador principal
- resolver navegacao visivel da aplicacao
- aplicar guards, metadata e paginas de erro do roteamento
- conectar eventos de infraestrutura com navegacao
- acoplar a arvore de layout do `shell` com o restante da aplicacao

## Regras de fronteira

- `app` pode depender de `core`, `shell` e das superficies publicas de `modules`
- `app` nao deve importar paginas internas de modulo fora da sua API publica
- `app` e o dono do contrato de navegacao da aplicacao
- `app` e o dono dos guards, metadata e handles de rota
- `app` nao deve concentrar regra de negocio de dominio

## Estrutura atual

Hoje `src/app` esta organizado assim:

```text
src/app/
  app.tsx
  globals.css
  providers.tsx
  root.layout.tsx
  router.ts
  infra/
    infra-navigation.tsx
    infra-navigation.types.ts
  navigation/
    navigation.ts
    navigation.types.ts
  routing/
    route-metadata.tsx
    route.types.ts
    guards/
      auth.guard.tsx
      permission.guard.tsx
    pages/
      error.page.tsx
      forbidden.page.tsx
      not-found.page.tsx
```

## Mapa por arquivo e pasta

### `app.tsx`

Responsabilidade:

- bootstrap do client React
- composicao de `AppProviders`
- montagem do `RouterProvider`

### `globals.css`

Responsabilidade:

- estilos globais da aplicacao
- regras de base que precisam existir antes da renderizacao das telas

### `providers.tsx`

Responsabilidade:

- compor a infraestrutura global da aplicacao
- garantir a ordem correta de inicializacao entre erro, navegacao de infraestrutura, tenant, tema, query client, sessao, permissao e socket

Ordem atual:

```tsx
<ErrorProvider>
  <InfraNavigation>
    <TenantProvider>
      <ThemeProvider>
        <QueryClientProvider client={apiQueryClient}>
          <SessionProvider>
            <PermissionProvider>
              <SocketProvider>{children}</SocketProvider>
            </PermissionProvider>
          </SessionProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </TenantProvider>
  </InfraNavigation>
</ErrorProvider>
```

### `root.layout.tsx`

Responsabilidade:

- montar o layout raiz da aplicacao
- resolver quais itens de navegacao estao visiveis
- acoplar `RouteMetadata`, `NavigationProgress` e `LayoutEngine`

Esse arquivo e o unico root layout real usado pelo roteador.

### `router.ts`

Responsabilidade:

- registrar a arvore principal do React Router
- aplicar guards publicos, autenticados e de permissao
- registrar paginas de erro e fallback de rotas
- consumir modulos de negocio apenas por sua superficie publica

## `infra/`

Responsabilidade:

- ligar eventos tecnicos do runtime com comportamento global do app

### `infra-navigation.tsx`

Responsabilidade:

- escutar eventos de infraestrutura vindos de API e socket
- traduzir esses eventos em navegacao global, como redirecionar para `/login`, `/403` ou `/404`

### `infra-navigation.types.ts`

Responsabilidade:

- tipar o conjunto de eventos que o `app` usa para reagir a navegacao de infraestrutura

## `navigation/`

Responsabilidade:

- definir os itens de navegacao da aplicacao
- aplicar a politica de visibilidade de acordo com o estado da sessao

### `navigation.types.ts`

Responsabilidade:

- definir o contrato de navegacao do `app`
- separar claramente visibilidade do item e status da sessao

Tipos principais:

- `AppNavigationVisibility`: `always`, `authenticated`, `anonymous`
- `AppNavigationItem`: item da navegacao da aplicacao
- `AppNavigationState`: snapshot minimo usado para resolver visibilidade

### `navigation.ts`

Responsabilidade:

- declarar `appNavigationItems`
- expor `resolveAppNavigationItems`
- decidir como a navegacao se comporta durante hydration ou loading da sessao

## `routing/`

Responsabilidade:

- concentrar tudo que e concern de roteamento da aplicacao

### `route.types.ts`

Responsabilidade:

- definir o contrato de handle das rotas da aplicacao
- tipar metadata e permissao por rota

### `route-metadata.tsx`

Responsabilidade:

- ler os `matches` ativos do router
- resolver `title` e `description`
- aplicar metadata final com fallback para `config.appName`

### `guards/`

Responsabilidade:

- proteger fluxo de acesso entre anonimato, autenticacao e permissao

Arquivos:

- `auth.guard.tsx`: bloqueia rotas autenticadas e redireciona anonimos para login
- `permission.guard.tsx`: valida permissao declarada no `handle` da rota

### `pages/`

Responsabilidade:

- renderizar paginas tecnicas de erro do roteamento

Arquivos:

- `error.page.tsx`: erro inesperado ou `RouteError`
- `forbidden.page.tsx`: acesso negado
- `not-found.page.tsx`: rota nao encontrada

## Fluxo dentro da aplicacao

O fluxo principal do `app` hoje e:

1. `app.tsx` sobe `AppProviders` e `RouterProvider`
2. `providers.tsx` prepara o runtime global
3. `router.ts` registra a arvore de rotas e guards
4. `root.layout.tsx` resolve metadata, progresso de navegacao e layout visual
5. `LayoutEngine` do `shell` renderiza a estrutura visual com os itens de navegacao recebidos

## Diretriz de manutencao

Ao alterar `src/app`, preserve estas regras:

- deixe no topo apenas os arquivos-base da aplicacao
- mantenha concerns especificos agrupados em `infra`, `navigation` e `routing`
- trate `app` como composicao da aplicacao, nao como modulo de negocio
- consuma modulos apenas por API publica
- nao coloque regras de layout visual detalhado dentro do `app`; isso pertence ao `shell`
- nao empurre concerns de roteamento para `shared` ou `core`

Se uma mudanca nova nao encaixar nessas regras, vale revisar a fronteira da camada antes de adicionar mais arquivos.
