/**
 * @store FormStoreState
 * @description Tipos do store do formulario. O estado contem o mapa de erros por campo
 * e actions para registrar/remover validadores e definir erros programaticamente.
 */

import type { ValidatorFn } from '../../lib/validator';
import type { FormErrors } from '../../src/form/_core/form.types';

// MARK: Init
export type FormStoreInit = {
  validators: Map<string, ValidatorFn>;
};

// MARK: Store State
export type FormStoreState = {
  errors: FormErrors;
  registerValidator: (name: string, fn: ValidatorFn) => void;
  unregisterValidator: (name: string) => void;
  setFieldError: (name: string, error: string | null) => void;
  setErrors: (errors: FormErrors) => void;
};
