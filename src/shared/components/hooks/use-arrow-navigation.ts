import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

/**
 * @hook useArrowNavigation
 * @description Adiciona navegacao por teclado (setas, Home, End, Escape) a listas e menus,
 * garantindo acessibilidade para usuarios que nao usam mouse.
 *
 * Opera em dois modos:
 * - **Modo elemento**: Move o foco diretamente entre elementos do DOM.
 *   Usa `containerRef` + `selector` para encontrar os itens navegaveis.
 *   Ideal para menus, sidebars e trees onde cada item e focavel.
 * - **Modo indice**: Gerencia um indice numerico sem mover foco no DOM.
 *   Usa `count` + `onHighlight` para notificar qual item esta destacado.
 *   Ideal para selects e autocompletes onde o highlight e visual (S).
 *
 * @param count - Total de itens navegaveis (apenas modo indice)
 * @param containerRef - Container que contem os itens navegaveis (apenas modo elemento)
 * @param selector - Seletor S dos itens dentro do container (apenas modo elemento)
 * @param orientation - Direcao: 'vertical' usa setas cima/baixo, 'horizontal' usa esquerda/direita
 * @param loop - Volta ao inicio ao passar do ultimo item e vice-versa (padrao: true)
 * @param homeEnd - Habilita Home para ir ao primeiro e End para ir ao ultimo (padrao: false)
 * @param onEscape - Funcao chamada ao pressionar Escape (ex: fechar dropdown)
 * @param onHighlight - Notifica qual indice esta destacado (apenas modo indice)
 * @param inputRef - Campo de input associado — seta para baixo sai do input para a lista (modo elemento)
 * @returns { highlightedIndex, setHighlightedIndex, onKeyDown } - Estado e handler de teclado
 *
 * @usage Select, Autocomplete, Tree, Tabs, SidebarSearch, SidebarPanel, PopoverMenu
 */

type UseArrowNavigationOptions = {
  count?: number;
  containerRef?: RefObject<HTMLElement | null>;
  selector?: string;
  orientation?: 'vertical' | 'horizontal';
  loop?: boolean;
  homeEnd?: boolean;
  onEscape?: () => void;
  onHighlight?: (index: number) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
};

type UseArrowNavigationReturn = {
  highlightedIndex: number;
  setHighlightedIndex: (v: number | ((prev: number) => number)) => void;
  onKeyDown: React.KeyboardEventHandler;
};

export function useArrowNavigation({
  count,
  containerRef,
  selector,
  orientation = 'vertical',
  loop = true,
  homeEnd = false,
  onEscape,
  onHighlight,
  inputRef,
}: UseArrowNavigationOptions): UseArrowNavigationReturn {
  const [highlightedIndex, setHighlightedIndexState] = useState(-1);
  const indexRef = useRef(-1);

  const onEscapeRef = useRef(onEscape);
  const onHighlightRef = useRef(onHighlight);
  const countRef = useRef(count);
  useEffect(() => {
    onEscapeRef.current = onEscape;
    onHighlightRef.current = onHighlight;
    countRef.current = count;
  });

  const setHighlightedIndex = useCallback((v: number | ((prev: number) => number)) => {
    setHighlightedIndexState((prev) => {
      const next = typeof v === 'function' ? v(prev) : v;
      indexRef.current = next;
      return next;
    });
  }, []);

  const isElementMode = containerRef !== undefined && selector !== undefined;
  const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
  const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';

  const containerRefStable = useRef(containerRef);
  const selectorRef = useRef(selector);
  const inputRefStable = useRef(inputRef);
  useEffect(() => {
    containerRefStable.current = containerRef;
    selectorRef.current = selector;
    inputRefStable.current = inputRef;
  });

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && onEscapeRef.current) {
        e.preventDefault();
        indexRef.current = -1;
        setHighlightedIndexState(-1);
        onEscapeRef.current();
        return;
      }

      if (isElementMode) {
        const container = containerRefStable.current?.current;
        if (!container) return;

        const items = Array.from(container.querySelectorAll<HTMLElement>(selectorRef.current!));
        if (!items.length && e.key !== 'Enter') return;

        const active = document.activeElement as HTMLElement;
        const current = items.indexOf(active);
        const input = inputRefStable.current?.current;

        if (input && active === input && e.key === 'Enter') {
          if (items.length > 0) {
            e.preventDefault();
            items[0].focus();
          }
          return;
        }

        if (input && active === input && e.key === nextKey) {
          e.preventDefault();
          items[0]?.focus();
          return;
        }

        if (input && current === 0 && e.key === prevKey) {
          e.preventDefault();
          input.focus();
          return;
        }

        if (e.key === nextKey) {
          e.preventDefault();
          const next = current < items.length - 1 ? current + 1 : loop ? 0 : current;
          items[next].focus();
        } else if (e.key === prevKey) {
          e.preventDefault();
          const prev = current > 0 ? current - 1 : loop ? items.length - 1 : 0;
          items[prev].focus();
        } else if (homeEnd && e.key === 'Home') {
          e.preventDefault();
          items[0]?.focus();
        } else if (homeEnd && e.key === 'End') {
          e.preventDefault();
          items[items.length - 1]?.focus();
        }
      } else {
        const total = countRef.current ?? 0;
        if (total === 0) return;
        const current = indexRef.current;

        let next: number | null = null;

        if (e.key === nextKey) {
          e.preventDefault();
          next = current < total - 1 ? current + 1 : loop ? 0 : current;
        } else if (e.key === prevKey) {
          e.preventDefault();
          next = current > 0 ? current - 1 : loop ? total - 1 : 0;
        } else if (homeEnd && e.key === 'Home') {
          e.preventDefault();
          next = 0;
        } else if (homeEnd && e.key === 'End') {
          e.preventDefault();
          next = total - 1;
        }

        if (next !== null) {
          indexRef.current = next;
          setHighlightedIndexState(next);
          onHighlightRef.current?.(next);
        }
      }
    },
    [isElementMode, nextKey, prevKey, loop, homeEnd],
  );

  return { highlightedIndex, setHighlightedIndex, onKeyDown };
}
