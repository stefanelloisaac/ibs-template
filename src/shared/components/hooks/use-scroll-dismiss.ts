import { useEffect, useRef } from 'react';

/**
 * @hook useScrollDismiss
 * @description Fecha popovers e tooltips quando a pagina rola, evitando que fiquem
 * visualmente desalinhados do elemento ancora. Usa `passive: true` para nao
 * impactar a performance de scroll.
 *
 * Por padrao escuta o scroll da `window`, mas aceita um alvo customizado
 * (ex: um container com scroll interno).
 *
 * @param active - Ativa/desativa a escuta. Quando `false`, nenhum listener e registrado.
 * @param onDismiss - Funcao chamada quando scroll e detectado
 * @param options.target - Elemento alvo do scroll (padrao: window)
 * @param options.capture - Se deve capturar o evento na fase de captura (padrao: false)
 * @returns void
 *
 * @usage Popover, Tooltip
 */

type UseScrollDismissOptions = {
  target?: () => EventTarget;
  capture?: boolean;
};

export function useScrollDismiss(active: boolean, onDismiss: () => void, options?: UseScrollDismissOptions): void {
  const onDismissRef = useRef(onDismiss);
  const getTargetRef = useRef(options?.target);
  useEffect(() => {
    onDismissRef.current = onDismiss;
    getTargetRef.current = options?.target;
  });

  const capture = options?.capture;

  useEffect(() => {
    if (!active) return;

    const target = getTargetRef.current?.() ?? window;
    const handler = () => onDismissRef.current();

    target.addEventListener('scroll', handler, { capture, passive: true });
    return () => target.removeEventListener('scroll', handler, { capture } as globalThis.EventListenerOptions);
  }, [active, capture]);
}
