/**
 * @lib numericSort
 * @description Comparador numerico para ordenacao de colunas da tabela.
 * Converte valores para numero e trata `null`/`undefined`/`NaN` como 0.
 *
 * @usage DataTable (registro de tipo de coluna 'number')
 */

export function numericSort(a: unknown, b: unknown): number {
  const na = Number(a) || 0;
  const nb = Number(b) || 0;
  return na - nb;
}

/**
 * @lib stringSort
 * @description Comparador de texto para ordenacao de colunas da tabela.
 * Usa `localeCompare` para ordenacao correta com acentos e caracteres especiais.
 * Trata `null`/`undefined` como string vazia.
 *
 * @usage DataTable (registro de tipo de coluna 'string')
 */

export function stringSort(a: unknown, b: unknown): number {
  return String(a ?? '').localeCompare(String(b ?? ''));
}

/**
 * @lib dateSort
 * @description Comparador de datas para ordenacao de colunas da tabela.
 * Aceita objetos `Date` ou strings de data. Datas invalidas sao tratadas como 0.
 *
 * @usage DataTable (registro de tipo de coluna 'date')
 */

export function dateSort(a: unknown, b: unknown): number {
  const da = a instanceof Date ? a.getTime() : new Date(String(a)).getTime();
  const db = b instanceof Date ? b.getTime() : new Date(String(b)).getTime();
  return (isNaN(da) ? 0 : da) - (isNaN(db) ? 0 : db);
}

/**
 * @lib booleanSort
 * @description Comparador booleano para ordenacao de colunas da tabela.
 * Converte valores truthy/falsy para 1/0 e ordena por diferenca.
 *
 * @usage DataTable (registro de tipo de coluna 'boolean')
 */

export function booleanSort(a: unknown, b: unknown): number {
  return (a ? 1 : 0) - (b ? 1 : 0);
}
