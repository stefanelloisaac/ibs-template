/**
 * @hook useForm*
 * @description Hooks pre-construidos para consumir slices do store do formulario.
 * Usados internamente pelos componentes de input para registrar validadores
 * e pelo Form para ler/definir erros.
 *
 * @usage Form, FormField, Input (todos os presets), Select, Radio,
 *        Autocomplete, Textarea
 */

import { useForm } from '../../providers/form.provider';

export const useFormErrors = () => useForm((s) => s.errors);
export const useFormSetFieldError = () => useForm((s) => s.setFieldError);
export const useFormRegisterValidator = () => useForm((s) => s.registerValidator);
export const useFormUnregisterValidator = () => useForm((s) => s.unregisterValidator);
