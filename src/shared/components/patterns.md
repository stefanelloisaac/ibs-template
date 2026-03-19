# Padroes de Componentes

Guia de referencia para contribuidores da biblioteca cs-design-kit.

---

## 1. Estrutura de Pastas

```
cs-componente/
├── _core/                  Componente base
│   ├── cs-componente.tsx
│   ├── cs-componente.types.ts
│   └── cs-componente.variants.ts
├── _presets/               Variacoes publicas (envolvem o core)
│   └── primary/
│       ├── cs-componente-primary.tsx
│       ├── cs-componente-primary.types.ts
│       └── cs-componente-primary.variants.ts
├── _parts/                 Sub-componentes internos (composicao)
│   ├── header/
│   └── body/
├── _features/              Logica isolada por feature
│   ├── cs-componente-sorting.ts
│   └── cs-componente-filtering.ts
└── index.ts                Barrel export
```

| Pasta       | Responsabilidade                              | Exemplo                                |
| ----------- | --------------------------------------------- | -------------------------------------- |
| `_core`     | Componente base, tipos, variants              | `CSButton`, `CSInput`                  |
| `_presets`  | Variacao estilizada que envolve o core        | `CSButtonPrimary` envolve `CSButton`   |
| `_parts`    | Sub-componentes de componentes complexos      | `CSDataTableHeader`, `CSDataTableBody` |
| `_features` | Logica de features (sorting, filtering, etc.) | `cs-data-table-sorting.ts`             |

Preset envolve o core via composicao:

```tsx
export function CSButtonPrimary(props: CSButtonPrimaryProps) {
  const { className, ...rest } = props;
  const styles = csButtonPrimaryVariants();
  return <CSButton {...rest} className={styles.root({ className })} />;
}
```

---

## 2. Tailwind Variants (`tv`)

Cada componente tem um arquivo `.variants.ts` usando `tv()` do `tailwind-variants`.

```ts
// cs-button.variants.ts
export const csButtonVariants = tv({
  slots: {
    root: 'inline-flex items-center justify-center font-medium rounded-md',
  },
  variants: {
    size: {
      sm: { root: 'h-8 px-3 text-sm' },
      md: { root: 'h-9 px-4 py-2' },
      lg: { root: 'h-10 px-6' },
    },
    fullWidth: {
      true: { root: 'w-full' },
    },
  },
  defaultVariants: { size: 'md' },
});
```

Consumo no componente:

```tsx
const styles = csButtonVariants({ size, fullWidth });

return (
  <button className={styles.root({ className })} {...rest}>
    {children}
  </button>
);
```

- `className` do consumidor sempre via `styles.slot({ className })` no slot alvo
- Tipos extraidos com `VariantProps<typeof csButtonVariants>` no `.types.ts`

---

## 3. Props — Desestruturacao no Body

Receber como `props: TypeName` na assinatura. Desestruturar no body.
A variavel rest sempre se chama `...rest` e e espalhada no elemento raiz.

```tsx
// Errado
export function CSButton({ className, size, ...rest }: CSButtonBaseProps) {

// Correto
export function CSButton(props: CSButtonBaseProps) {
  const { className, size, loading, disabled, children, id, ref, ...rest } = props;

  return (
    <button ref={ref} id={buttonId} className={styles.root({ className })} {...rest}>
      {children}
    </button>
  );
}
```

### Ordem de desestruturacao

| #   | Grupo                   | Exemplos                                                                      |
| --- | ----------------------- | ----------------------------------------------------------------------------- |
| 1   | `className`             | Sempre primeiro                                                               |
| 2   | Aparencia/layout        | `intent`, `size`, `variant`, `fullWidth`, `placement`, `labelPosition`        |
| 3   | Conteudo/texto          | `label`, `placeholder`, `title`, `description`, `icon`, `content`, `children` |
| 4   | Dados/opcoes            | `options`, `data`, `columns`, `nodes`, `items`                                |
| 5   | Estado/valor            | `value`, `defaultValue`, `onValueChange`, `open`                              |
| 6   | Atributos de formulario | `name`, `required`, `disabled`, `errorMessage`                                |
| 7   | Event handlers          | `onChange`, `onBlur`, `onSubmit`, `onClick`                                   |
| 8   | `id`                    |                                                                               |
| 9   | `ref`                   |                                                                               |
| 10  | `...rest`               | Sempre ultimo                                                                 |

---

## 4. Props — useId

Gerar ID estavel com `useId()`. Usar o `id` do consumidor se fornecido.
Derivar IDs filhos a partir do base.

```tsx
const generatedId = useId();
const inputId = id || generatedId;
const errorId = `${inputId}-error`;
```

---

## 5. Props — Omit em Presets

Presets fazem `Omit` das props que controlam internamente e re-declaram com o tipo correto.

```ts
// Base: value e string (vem de React.ComponentProps<'input'>)
type CSInputBaseProps = React.ComponentProps<'input'> & {
  label?: string;
  errorMessage?: string;
};

// Preset: remove type/value/defaultValue e re-declara como number
type CSInputMoneyProps = Omit<CSInputBaseProps, 'type' | 'inputMode' | 'value' | 'defaultValue'> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  locale?: string;
  currency?: string;
};
```

---

## 6. onChange + onValueChange

Ambos coexistem intencionalmente nos presets de input.

| Callback        | Origem                          | Dispara                                   | Uso                                     |
| --------------- | ------------------------------- | ----------------------------------------- | --------------------------------------- |
| `onChange`      | `React.ComponentProps<'input'>` | `React.ChangeEvent` (evento nativo)       | Form libraries, event delegation        |
| `onValueChange` | Prop customizada                | Valor limpo e tipado (`number`, `string`) | API ergonomica para a maioria dos casos |

`useControllable` conecta no `onValueChange` para gerenciar estado controlado/nao-controlado.
O componente chama `onChange?.(e)` para repassar o evento nativo.

```tsx
const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const parsed = parseNumber(e.target.value);
  setValue(parsed); // dispara onValueChange
  onChange?.(e); // repassa evento nativo
};
```

---

## 7. Contrato de Ref

### Componentes visuais

`ref` aponta para o elemento DOM raiz. Funciona com `...rest` spread.

```tsx
export function CSButton(props: CSButtonBaseProps) {
  const { ref, ...rest } = props;
  return <button ref={ref} {...rest} />;
}
```

### Componentes imperativos

`ref` tipado como `React.Ref<CSComponentRef>` e exposto via `useImperativeHandle`.
Estes componentes **NAO** espalham `...rest` no elemento DOM — o tipo do ref imperativo e incompativel com refs de `HTMLElement` (limitacao TypeScript com generics).

```tsx
type CSDataTableRef<TData> = {
  updateCell: (rowId: string, columnId: string, value: unknown) => void;
  getData: () => TData[];
};

export function CSDataTable<TData>(props: CSDataTableBaseProps<TData>) {
  const { data, columns, ref, className } = props; // sem ...rest

  useImperativeHandle(ref, () => ({
    updateCell: (...) => { /* ... */ },
    getData: () => { /* ... */ },
  }));

  return <div className={className}>...</div>; // sem {...rest}
}
```

| Componente    | Tipo do ref             |
| ------------- | ----------------------- |
| `CSDataTable` | `CSDataTableRef<TData>` |
| `CSForm`      | `CSFormRef`             |

---

## 8. Store (Zustand) para Estado Complexo

Componentes com estado complexo (CSDataTable) usam Zustand com o seguinte fluxo:

```
Factory (createStore) → Provider (React Context) → Hooks (useDataTable*)
```

**Factory** — cria o store uma unica vez:

```tsx
const [store] = useState(() => createDataTableStore({ data, columns, config }));
```

**Provider** — distribui via Context:

```tsx
<CSDataTableProvider store={store}>
  <CSDataTableHeader />
  <CSDataTableBody />
</CSDataTableProvider>
```

**Hooks** — cada \_part consome apenas o slice que precisa (evita re-renders):

```tsx
export const useDataTableColumns = () => useDataTable((s) => s.columns);
export const useDataTableSorting = () => useDataTable((s) => s.sorting);
export const useDataTableSelection = () => useDataTable((s) => s.selection);
```

Sincronizacao de mudancas externas via `_sync` no `useLayoutEffect`.

---

## 9. Hooks Compartilhados

| Hook                 | Descricao                                                     |
| -------------------- | ------------------------------------------------------------- |
| `useControllable`    | Estado controlado/nao-controlado — conecta em `onValueChange` |
| `useDebounce`        | Atrasa execucao de callback                                   |
| `useArrowNavigation` | Navegacao por teclado (setas, Home, End, Escape)              |
| `useClickOutside`    | Fecha overlay ao clicar fora                                  |
| `useDialogElement`   | Controle de `<dialog>` nativo com animacoes                   |
| `useAnimationEnd`    | Aguarda animacao CSS de saida antes de desmontar              |
| `useScrollDismiss`   | Fecha overlay ao rolar a pagina                               |

`useControllable` e o mais usado — padrao central para componentes controlados:

```tsx
const [value, setValue] = useControllable<string>(
  controlledValue, // props.value (pode ser undefined)
  defaultValue, // props.defaultValue
  onValueChange, // callback para notificar mudancas
);
```

Quando `controlledValue` e `undefined`, usa estado interno (nao-controlado).
Em ambos os modos, `onValueChange` e chamado ao mudar.

---

## 10. Utilitarios (`lib/`)

| Utilitario        | Descricao                                                                      |
| ----------------- | ------------------------------------------------------------------------------ |
| `CSErrorBoundary` | Captura erros de render — componente que falha exibe erro sem quebrar a pagina |
| `createValidator` | Pipeline de validacao encadeavel (`transform` → `refine` → `validate`)         |
| `mergeRefs`       | Combina multiplos refs em um unico callback                                    |
| `sort/`           | Funcoes de comparacao: `numericSort`, `stringSort`, `dateSort`, `booleanSort`  |

**CSErrorBoundary** — envolve componentes complexos:

```tsx
return (
  <CSErrorBoundary>
    <div data-slot='accordion'>{/* conteudo */}</div>
  </CSErrorBoundary>
);
```

**createValidator** — usado nos arquivos `.validate.ts`:

```tsx
export const validateInputText = (value: string) =>
  createValidator(value)
    .transform((v) => v.trim())
    .refine((v) => v.length > 0, 'Campo obrigatorio.')
    .validate();
```

---

## 11. Integracao com CSForm

1. Componente define `validatorKey` estatico:

   ```tsx
   CSInputText.validatorKey = 'input-text';
   ```

2. Arquivo `.validate.ts` exporta a funcao de validacao usando `createValidator`

3. Registry em `cs-form/_core/cs-form.registry.ts` mapeia key → validator:

   ```ts
   export const validatorRegistry: Record<string, ValidatorFn> = {
     'input-text': validateInputText,
     'input-email': validateInputEmail,
     select: validateSelect,
   };
   ```

4. Componentes onde o valor visivel difere do valor do form (ex: autocomplete) usam um `<input>` hidden sr-only com o `name` e valor real. O hidden input **NAO** usa `readOnly` (impede constraint validation).

---

## 12. data-slot

Todo componente marca o elemento raiz com `data-slot`.

```tsx
<button data-slot='button' className={styles.root({ className })} {...rest}>
<input data-slot='input' className={styles.control({ className })} {...rest} />
<div data-slot='data-table' className={styles.root({ className })}>
```

Sub-partes usam nomes compostos:

```tsx
<thead data-slot='data-table-header'>
<tbody data-slot='data-table-body'>
<tr data-slot='data-table-row'>
```

---

## 13. Exports (Barrel + Namespace CS)

Cada componente tem `index.ts` exportando seus presets:

```ts
// cs-button/index.ts
export { CSButtonPrimary } from './_presets/primary/cs-button-primary';
export { CSButtonSecondary } from './_presets/secondary/cs-button-secondary';
```

O entry point principal monta o objeto `CS`:

```ts
export const CS = {
  ButtonPrimary: CSButtonPrimary,
  InputText: CSInputText,
  DataTable: CSDataTable,
  // ...
};
```
