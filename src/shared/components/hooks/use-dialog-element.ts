import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useAnimationEnd } from './use-animation-end';

/**
 * @hook useDialogElement
 * @description Controla abertura e fechamento de modais e drawers usando o elemento nativo
 * `<dialog>` do browser, que fornece backdrop, trap de foco e fechamento via Escape nativamente.
 *
 * Ao abrir: chama `showModal()` e salva qual elemento tinha foco antes.
 * Ao fechar: executa a animacao de saida (via `useAnimationEnd`), depois fecha o dialog
 * e restaura o foco ao elemento anterior — garantindo boa experiencia de acessibilidade.
 * O Escape e interceptado para passar pelo callback `onClose` em vez de fechar direto.
 *
 * @param open - Se o dialog deve estar aberto (controlado pelo sistema consumidor)
 * @param onClose - Funcao chamada quando o usuario solicita fechamento (Escape ou acao interna)
 * @param onOpen - Funcao opcional chamada quando o dialog abre
 * @returns { dialogRef, isClosing } - Ref para o `<dialog>` e flag que indica animacao de saida em andamento
 *
 * @usage Dialog, Drawer, SidebarSearch
 */

type UseDialogElementOptions = {
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
};

type UseDialogElementReturn = {
  dialogRef: RefObject<HTMLDialogElement | null>;
  isClosing: boolean;
};

export function useDialogElement({ open, onClose, onOpen }: UseDialogElementOptions): UseDialogElementReturn {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  const onCloseRef = useRef(onClose);
  const onOpenRef = useRef(onOpen);
  useEffect(() => {
    onCloseRef.current = onClose;
    onOpenRef.current = onOpen;
  });

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setIsClosing(false);
    else setIsClosing(true);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open || dialog.open) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    dialog.showModal();
    onOpenRef.current?.();
  }, [open]);

  const handleClosingEnd = useCallback(() => {
    setIsClosing(false);
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    previousFocusRef.current?.focus();
    previousFocusRef.current = null;
  }, []);

  useAnimationEnd(dialogRef, isClosing, handleClosingEnd);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onCloseRef.current();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, []);

  return { dialogRef, isClosing };
}
