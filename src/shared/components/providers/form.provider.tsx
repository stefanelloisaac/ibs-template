import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import type { FormStoreApi, FormStoreState } from '../store/form/form.store';

/**
 * @provider FormStoreProvider
 * @description Disponibiliza o store Zustand do formulario via React Context.
 * O store e criado externamente pelo componente Form e passado como prop.
 * Os campos de input consomem o store para registrar validadores e reportar erros
 * atraves dos hooks `useForm` e `useFormStoreApi`.
 */

interface FormProviderProps {
  store: FormStoreApi;
  children: React.ReactNode;
}

const FormContext = createContext<FormStoreApi | null>(null);

export function FormStoreProvider({ store, children }: FormProviderProps) {
  return <FormContext.Provider value={store}>{children}</FormContext.Provider>;
}

export function useFormStoreApi(): FormStoreApi {
  const store = useContext(FormContext);
  if (!store) throw new Error('Form: must be used within <Form>');
  return store;
}

export function useForm<T>(selector: (state: FormStoreState) => T): T {
  const store = useFormStoreApi();
  return useStore(store, selector);
}
