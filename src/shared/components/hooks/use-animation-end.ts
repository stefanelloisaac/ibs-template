import { useEffect, type RefObject } from 'react';

/**
 * @hook useAnimationEnd
 * @description Aguarda uma animacao S de saida (fade-out, slide-out) terminar antes de
 * executar uma acao — geralmente remover o componente do DOM ou fechar um dialog.
 *
 * Detecta automaticamente se o elemento possui animacao. Se nao houver, executa
 * o callback imediatamente. Inclui um timeout de seguranca para garantir que o
 * callback sempre execute, mesmo que o evento `animationend` nao dispare.
 *
 * @param ref - Referencia ao elemento que esta animando
 * @param isActive - Quando `true`, comeca a aguardar o fim da animacao
 * @param onEnd - Funcao executada quando a animacao termina (ou imediatamente se nao ha animacao)
 * @returns void
 *
 * @usage Popover, PopoverListbox, SidebarPanel, Tooltip
 */

export function useAnimationEnd(ref: RefObject<HTMLElement | null>, isActive: boolean, onEnd: () => void) {
  useEffect(() => {
    if (!isActive || !ref.current) return;
    const el = ref.current;

    const { animationDuration } = getComputedStyle(el);
    if (!animationDuration || animationDuration === '0s') {
      onEnd();
      return;
    }

    const fallback = setTimeout(onEnd, parseFloat(animationDuration) * 1000 + 50);
    const handleAnimationEnd = () => {
      clearTimeout(fallback);
      onEnd();
    };

    el.addEventListener('animationend', handleAnimationEnd, { once: true });
    return () => {
      clearTimeout(fallback);
      el.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [isActive, ref, onEnd]);
}
