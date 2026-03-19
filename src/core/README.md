# Arquitetura do Core

`src/core` e a camada de infraestrutura compartilhada da aplicacao.

Ela concentra runtime, providers React, clientes tecnicos, tipos e helpers que sustentam `app`, `modules` e o restante do sistema sem conhecer negocio ou layout.

## Objetivo do `core`

Na pratica, o `core` cobre:

- comunicacao HTTP
- tratamento global de erro
- sessao e autenticacao no runtime
- tenant, branding e tema inicial
- permissoes
- socket
- tema local da interface

## Regras de fronteira

- `core` pode depender de bibliotecas externas, de outros modulos do `core` e de codigo gerado quando isso fizer parte da infraestrutura
- `core` nao deve depender de `src/app`, `src/modules`, `src/shared` ou `src/shell`
- `core` nao conhece router, guards, metadata de rota ou layout da aplicacao
- integracoes de navegacao e efeitos especificos da aplicacao ficam em `src/app/infra`

## Estrutura atual

Hoje `src/core` contem:

```text
src/core/
  api/
  error/
  permission/
  session/
  socket/
  tenant/
  theme/
```

## Padrao de organizacao

Cada modulo do `core` tende a combinar algumas destas pastas:

```text
<feature>/
  index.ts
  runtime/
  react/
  support/
```

Semantica esperada:

- `index.ts`: superficie publica do modulo
- `runtime/`: estado, client e orquestracao fora do React
- `react/`: provider, contexto e hooks publicos
- `support/`: tipos, API, config, constantes, helpers e erros especificos

Regras de semantica interna:

- `index.ts` deve expor uma superficie publica pequena e intencional
- helpers internos nao devem sair pelo barrel sem necessidade real
- `runtime/` concentra estado inicial, store e bootstrap
- `runtime/*.bootstrap.ts` so deve existir quando representar bootstrap real de inicializacao
- `runtime/*.runtime.ts` deve concentrar orquestracao operacional do modulo
- `support/*.config.ts` resolve ambiente, hostname ou policy de configuracao
- `support/*.constants.ts` guarda constantes semanticas, nao estado inicial de runtime
- `support/*.utils.ts` guarda helpers tecnicos do modulo
- `support/*.types.ts` guarda os contratos do modulo
- tipos internos de boundary, provider ou contexto nao devem sair pelo barrel sem necessidade real

Nem todo modulo precisa ter todas as pastas. O importante e manter a responsabilidade de cada arquivo clara.

## Responsabilidade por tipo de arquivo

Esta secao define o que cada tipo de arquivo deve tratar dentro do `core`.

### `index.ts`

Responsabilidade:

- expor a superficie publica oficial do modulo
- servir como ponto unico de consumo para o restante da aplicacao

Deve conter:

- providers publicos
- hooks publicos
- tipos publicos
- funcoes de runtime realmente consumidas fora do modulo

Nao deve conter:

- reexport de helper interno so por conveniencia
- tipos internos de implementacao sem uso externo real

Exemplo correto:

- `session/index.ts` exporta `SessionProvider`, `useSession` e acoes publicas de sessao

Exemplo incorreto:

- exportar um helper usado apenas pelo proprio provider do modulo

### `runtime/*.bootstrap.ts`

Responsabilidade:

- inicializacao do modulo
- resolucao do estado inicial
- carga inicial de dados ou configuracao

Deve conter:

- montagem do estado inicial
- fallback de bootstrap
- leitura inicial de dados necessarios para o modulo subir

Nao deve conter:

- adapter React
- JSX
- API publica de contexto

Exemplo correto:

- `tenant/bootstrap` resolve config inicial e fallback local
- `session/bootstrap` carrega os dados iniciais da sessao

### `runtime/*.runtime.ts`

Responsabilidade:

- orquestracao operacional do modulo fora do React
- API de runtime consumida por providers ou por outros modulos do `core`

Deve conter:

- subscribe/getSnapshot
- comandos e acoes do modulo
- coordenacao entre store, client e bootstrap

Nao deve conter:

- JSX
- acesso direto a contexto React
- detalhes visuais

Exemplo correto:

- `session.runtime.ts` coordena hidratacao, refresh e clear
- `socket.runtime.ts` coordena connect, disconnect e state
- `permission.runtime.ts` resolve ownerKey, recurso atual e fetch de permissao

### `runtime/*.store.ts`

Responsabilidade:

- guardar estado mutavel do runtime
- notificar listeners

Deve conter:

- estado inicial do runtime
- `getState`
- `setState`
- `subscribe`

Nao deve conter:

- fetch
- regra de negocio complexa
- JSX

Exemplo correto:

- `session.store.ts`
- `socket.store.ts`

### `runtime/*.events.ts`

Responsabilidade:

- publicar e consumir eventos internos de infraestrutura
- traduzir eventos tecnicos para sinais consumiveis por outros modulos

Deve conter:

- subscribe de eventos
- emit de eventos
- tratamento global tecnico

Nao deve conter:

- JSX
- regra de layout ou navegacao da app

Exemplo correto:

- `api.events.ts`
- `socket.events.ts`

### `runtime/*.client.ts`

Responsabilidade:

- encapsular client tecnico de integracao externa

Deve conter:

- criacao/configuracao do client
- detalhes de comunicacao com API, websocket ou lib externa

Nao deve conter:

- JSX
- contexto React
- regras de UI

Exemplo correto:

- `api.client.ts`
- `socket.client.ts`

### `react/*.provider.tsx`

Responsabilidade:

- adaptar o runtime ou suporte tecnico para a arvore React
- expor contexto para consumo de filhos

Deve conter:

- montagem do valor do contexto
- integracao entre hooks React e API do runtime
- guardas de renderizacao quando forem realmente parte do modulo

Nao deve conter:

- regra de negocio de modulo de dominio
- layout
- helpers genericos que deveriam estar em `support`

Exemplo correto:

- `SessionProvider` consome subscribe/getSnapshot e expoe valor do contexto
- `PermissionProvider` adapta o runtime de permissao para `can` e `cannot`

### `react/*.context.ts`

Responsabilidade:

- declarar o contexto React do modulo

Deve conter:

- `createContext`
- tipagem do contexto importada de `support/types`

Nao deve conter:

- hooks
- provider
- logica de runtime

### `react/*.hooks.ts`

Responsabilidade:

- expor hooks publicos do modulo

Deve conter:

- `useX`
- validacao de uso dentro do provider
- hooks derivados simples, como `useSocketStatus`

Nao deve conter:

- logica de bootstrap
- client externo
- regra visual

### `support/*.config.ts`

Responsabilidade:

- resolver ambiente, hostname ou policy de configuracao

Deve conter:

- leitura de `import.meta.env`
- resolucao de hostname
- funcoes de policy/configuracao

Nao deve conter:

- estado inicial de runtime
- bootstrap
- JSX

Exemplo correto:

- `api.config.ts`
- `socket.config.ts`
- `tenant.config.ts`

### `support/*.constants.ts`

Responsabilidade:

- guardar constantes semanticas do modulo

Deve conter:

- strings de erro
- wildcards
- listas fixas de status

Nao deve conter:

- estado inicial de runtime
- objeto mutavel
- resultado de bootstrap

Exemplo correto:

- `API_NON_RETRYABLE_STATUSES`
- `SOCKET_AUTH_ERROR_TYPE`
- `PERMISSION_WILDCARD_ACTION`

### `support/*.utils.ts`

Responsabilidade:

- guardar helpers tecnicos e puros do modulo

Deve conter:

- funcoes auxiliares reutilizaveis
- transformacoes pequenas
- comparacoes e validacoes de suporte

Nao deve conter:

- JSX
- subscribe/store
- superficie publica que deveria sair de `runtime`

Exemplo correto:

- `apiBuildUrl`
- `permissionCan`
- `tenantApplyBranding`

### `support/*.types.ts`

Responsabilidade:

- centralizar contratos do modulo

Deve conter:

- tipos de contexto
- tipos de runtime
- tipos de props publicas do modulo
- contratos de dominio tecnico da feature

Nao deve conter:

- tipo morto ou especulativo
- tipo de detalhe local que so um arquivo usa e nao agrega clareza

### `support/*.api.ts`

Responsabilidade:

- encapsular chamadas tecnicas de I/O do proprio modulo quando isso nao estiver no client gerado

Deve conter:

- funcoes de fetch tecnicas do modulo
- chamadas para `apiRequest`

Nao deve conter:

- regra React
- estado
- JSX

Exemplo correto:

- `tenant.api.ts`
- `permission.api.ts`

### `support/*.error.ts`

Responsabilidade:

- declarar erros tecnicos especificos do modulo

Deve conter:

- classes de erro
- type guards de erro

Nao deve conter:

- fallback page
- boundary React

Exemplo correto:

- `api.error.ts`
- `socket.error.ts`

## Fluxo dentro da aplicacao

O `core` entra na arvore pelo arquivo `src/app/providers.tsx`, nesta ordem:

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

Essa sequencia garante:

- captura global de erro desde o topo
- efeitos de navegacao da aplicacao fora do `core`
- tenant resolvido antes do restante da experiencia visual
- tema local disponivel para a interface
- React Query inicializado antes de sessao e permissoes
- sessao antes de permissao e socket
- socket reagindo ao estado autenticado atual

## Diretriz de manutencao

Ao adicionar ou refatorar um modulo em `src/core`:

- preserve a separacao entre runtime, React e suporte tecnico
- evite importar detalhes de negocio, router ou layout
- prefira expor uma API pequena e previsivel pelo `index.ts`
- mantenha arquivos de `support` como dependencias tecnicas, nao como acumuladores de regra de negocio
- se uma nova capacidade nao encaixar nessa organizacao, revise a fronteira antes de expandir o modulo
