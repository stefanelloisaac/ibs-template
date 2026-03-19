/**
 * @lib mergeRefs
 * @description Combina multiplas refs em uma unica ref callback, permitindo que um elemento
 * seja referenciado por mais de uma ref ao mesmo tempo (ex: ref interna do componente + ref do consumidor).
 *
 * Aceita refs de funcao, refs de objeto (`useRef`) e `undefined` — ignora valores nulos.
 *
 * @param refs - Lista de refs a serem combinadas
 * @returns Ref callback unica que atualiza todas as refs recebidas
 *
 * @usage Dialog, Drawer, Popover, Tooltip, SidebarRail, SidebarPanel, Tree, PopoverListbox
 */

export function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}
