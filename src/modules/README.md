# Arquitetura do Modules

`src/modules` e a camada de negocio da aplicacao.

Ela existe para concentrar capacidades de dominio, paginas de negocio e rotas que o `app` consome como superficie publica.

## Objetivo do `modules`

Cada modulo deve representar uma capacidade de negocio claramente identificavel.

Na pratica, `modules` cobre:

- paginas de dominio
- rotas do modulo
- tipos semanticos do modulo
- utilitarios puros do modulo
- futuros formularios, componentes internos, schemas, services ou store, quando houver necessidade real

## Regras de fronteira

- `modules` pode depender de `core`
- `modules` pode depender de `generated`
- `modules` pode depender de `react-router`
- `modules` pode depender de `@/app/routing/route.types` para metadata e permissao de rota
- `modules` pode depender de `shared` apenas para primitivas realmente neutras
- `modules` nao deve depender de `shell`
- `modules` nao deve importar arquivos internos de outro modulo
- `app` deve consumir modulos apenas pela sua superficie publica

## Estrutura minima obrigatoria

Todo modulo deve nascer com a menor estrutura possivel:

```text
src/modules/<modulo>/
  index.ts
  <modulo>.routes.ts
  pages/
  types/
  utils/
```

Essa e a estrutura minima recomendada para modulos com rotas e paginas.

## Estrutura sob demanda

Novas pastas so devem ser criadas quando houver necessidade real.

Pastas opcionais permitidas:

```text
components/
forms/
schemas/
services/
application/
constants/
store/
```

Regras importantes:

- nao criar pasta para o futuro
- nao usar `.gitkeep` para reservar estrutura especulativa
- nao usar underscore em nome de pasta

## Contrato de um modulo

### `index.ts`

Responsabilidade:

- expor a superficie publica do modulo

Esse arquivo e obrigatorio.

Ele deve exportar apenas o que o resto da aplicacao pode consumir oficialmente.

### `<modulo>.routes.ts`

Responsabilidade:

- definir as rotas do modulo
- aplicar metadata e permissao via `AppRouteHandle`
- lazy-load das pages do proprio modulo

Essa dependencia em `@/app/routing/route.types` e oficial e permitida.

### `pages/`

Responsabilidade:

- conter apenas paginas do modulo

Nomenclatura:

- `<nome>.page.tsx`

### `types/`

Responsabilidade:

- conter tipos semanticos do modulo

Nomenclatura:

- `<modulo>-<assunto>.types.ts`
- ou `<assunto>.types.ts` quando o contexto ja estiver claro pela pasta

### `utils/`

Responsabilidade:

- conter helpers puros do modulo

Nomenclatura:

- `<modulo>-<assunto>.utils.ts`
- ou `<assunto>.utils.ts` quando o contexto ja estiver claro pela pasta

## O que nao deve ir para `shared`

Se o artefato e reutilizavel, mas continua sendo regra de negocio, ele nao vai para `shared`.

Exemplo:

- formulario de empresa reutilizavel em varios modulos

Lugar correto:

```text
src/modules/empresa/
  index.ts
  empresa.routes.ts
  forms/
    empresa-form.tsx
    empresa-form.types.ts
```

Regra:

- reuso de negocio continua em `modules`
- `shared` recebe apenas primitivas neutras

## Estado atual

Hoje `auth` e o modulo piloto da aplicacao.

Ele funciona como referencia para:

- superficie publica via `index.ts`
- rotas centralizadas em `auth.routes.ts`
- pages em `pages/`
- tipos em `types/`
- utilitarios em `utils/`

## Diretriz de manutencao

Ao criar ou refatorar um modulo:

- comece pequeno
- exponha apenas a API publica no `index.ts`
- mantenha `app` consumindo o modulo pela superficie publica
- adicione novas pastas apenas quando a complexidade do modulo exigir
- nao use estruturas com underscore
- nao deixe diretorios vazios no modulo

Se um novo artefato nao for claramente pagina, tipo, util, rota ou API publica do modulo, vale revisar o desenho antes de criar mais estrutura.
