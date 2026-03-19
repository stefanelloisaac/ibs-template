import type { ValidationResult } from './validator.types';

/**
 * @lib createValidator
 * @description Cria uma cadeia de validacao encadeavel para valores de formulario.
 * Permite transformar o valor (ex: remover mascara) e adicionar regras de validacao
 * em sequencia. Se uma regra falha, as seguintes sao ignoradas (short-circuit).
 *
 * Usado internamente pelos arquivos `.validate.ts` de cada componente de input
 * para definir as regras de validacao nativas do Form.
 *
 * @param value - Valor a ser validado (geralmente a string do input)
 * @returns Cadeia com `.transform()`, `.refine()` e `.validate()`
 *
 * @usage InputText, InputEmail, InputDocs, InputMoney, Select, Radio,
 *        AutocompleteSingle, AutocompleteMultiple, Textarea (via arquivos .validate.ts)
 */

export function createValidator<T>(value: T) {
  let current = value;
  let error: string | null = null;

  const chain = {
    transform<U>(fn: (val: T) => U) {
      if (!error) current = fn(current) as unknown as T;
      return chain as unknown as ReturnType<typeof createValidator<U>>;
    },

    refine(fn: (val: T) => boolean, message: string) {
      if (!error && !fn(current)) error = message;
      return chain;
    },

    validate(): ValidationResult<T> {
      if (error) return { success: false, message: error };
      return { success: true, data: current };
    },
  };

  return chain;
}
