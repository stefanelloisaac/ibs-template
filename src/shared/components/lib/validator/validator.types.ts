/**
 * @lib ValidationResult
 * @description Resultado de uma validacao — sucesso com o dado transformado, ou falha com mensagem de erro.
 * Discriminated union: `success: true` contem `data`, `success: false` contem `message`.
 */

export type ValidationResult<T = unknown> = { success: true; data: T } | { success: false; message: string };

/**
 * @lib ValidatorFn
 * @description Assinatura padrao de uma funcao validadora de campo de formulario.
 * Recebe o valor do input como string e retorna um `ValidationResult`.
 * Cada componente de input registra sua `ValidatorFn` no `cs-form.registry.ts`.
 */

export type ValidatorFn = (value: string) => ValidationResult;
