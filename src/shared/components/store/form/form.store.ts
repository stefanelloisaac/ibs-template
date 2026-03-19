import { createStore } from 'zustand';
import type { FormStoreInit, FormStoreState } from './form.types';

export type { FormStoreInit, FormStoreState } from './form.types';

/**
 * @store createFormStore
 * @description Fabrica do store Zustand do Form. Gerencia o mapa de erros de validacao
 * e o registro dinamico de validadores. Cada campo de input registra seu validador ao montar
 * e remove ao desmontar. O Form executa todos os validadores registrados ao submeter.
 *
 * @param init - { validators: Map de funcoes validadoras (compartilhado por referencia) }
 * @returns Store Zustand com estado de erros e actions de registro/validacao
 */

// MARK: StoreApi
export type FormStoreApi = ReturnType<typeof createFormStore>;

// MARK: Factory
export function createFormStore(init: FormStoreInit) {
  const { validators } = init;

  const store = createStore<FormStoreState>()((set) => ({
    errors: {},

    registerValidator: (name, fn) => {
      validators.set(name, fn);
    },

    unregisterValidator: (name) => {
      validators.delete(name);
    },

    setFieldError: (name, error) => {
      set((prev) => {
        if (error) return { errors: { ...prev.errors, [name]: error } };
        const { [name]: _, ...rest } = prev.errors;
        return { errors: rest };
      });
    },

    setErrors: (errors) => {
      set({ errors });
    },
  }));

  return store;
}
