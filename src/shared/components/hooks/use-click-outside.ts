import { useEffect } from 'react';

type ClickOutsideRef = React.RefObject<HTMLElement | null>;

/**
 * @hook useClickOutside
 * @description Fecha dropdowns, popovers e sidebars quando o usuario clica fora deles.
 * Monitora cliques no documento e verifica se o alvo esta fora dos elementos protegidos.
 * So ativa a escuta quando o componente esta aberto (`isOpen = true`).
 *
 * Aceita uma ref unica ou um array de refs para proteger multiplos elementos
 * (ex: o trigger e o painel de um popover ao mesmo tempo).
 *
 * @param ref - Elemento(s) que devem ser considerados "dentro" — cliques neles nao disparam fechamento
 * @param isOpen - Ativa/desativa a escuta. Quando `false`, nenhum listener e registrado.
 * @param onClose - Funcao chamada quando um clique fora e detectado
 * @returns void
 *
 * @usage Autocomplete, Popover, Sidebar
 */

export function useClickOutside(ref: ClickOutsideRef | ClickOutsideRef[], isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;
    const refs = Array.isArray(ref) ? ref : [ref];
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (refs.some((r) => r.current?.contains(target))) return;
      onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, ref, onClose]);
}
