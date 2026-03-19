/**
 * @hook useToast*
 * @description Hooks pre-construidos para consumir slices do store de toasts.
 * O sistema consumidor usa `useToastDispatch()` para disparar toasts e
 * `useToastItems()` para listar. Cada hook seleciona exatamente um slice.
 *
 * @usage ToastContainer, sistema consumidor
 */

import { useToast } from '../../providers/toast.provider';

export const useToastItems = () => useToast((s) => s.toasts);
export const useToastPosition = () => useToast((s) => s.position);
export const useToastDispatch = () => useToast((s) => s.toast);
export const useToastDismiss = () => useToast((s) => s.dismiss);
export const useToastDismissAll = () => useToast((s) => s.dismissAll);
