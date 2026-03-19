import type { DataTableVisibilityProps } from '../../../src/data-table/_core/data-table.types';
import type { Recompute, StoreGet } from '../data-table.types';

/**
 * @store createColumnsActions
 * @description Actions de colunas: visibilidade (toggle show/hide), largura (resize)
 * e pinning (fixar coluna na esquerda ou direita). Suporta modo controlado/nao-controlado
 * para visibilidade.
 */

export function createColumnsActions<TData>(get: StoreGet<TData>, recompute: Recompute<TData>) {
  const toggleVisibility = (columnId: string) => {
    const s = get();
    const cfg = s._config;
    const vCfg = typeof cfg.visibility === 'object' ? (cfg.visibility as DataTableVisibilityProps) : undefined;
    const isControlled = vCfg?.state !== undefined;
    const current = vCfg?.state ?? s._visibilityState;
    const next = { ...current };
    if (next[columnId] === false) delete next[columnId];
    else next[columnId] = false;
    if (isControlled) {
      vCfg?.onChange?.(next);
    } else {
      vCfg?.onChange?.(next);
      recompute({ _visibilityState: next });
    }
  };

  const setWidth = (columnId: string, width: number) => {
    recompute({ _widths: { ...get()._widths, [columnId]: width } });
  };

  const pin = (columnId: string, side: 'left' | 'right') => {
    recompute({ _pinningState: { ...get()._pinningState, [columnId]: side } });
  };

  const unpin = (columnId: string) => {
    const next = { ...get()._pinningState };
    delete next[columnId];
    recompute({ _pinningState: next });
  };

  return { toggleVisibility, setWidth, pin, unpin };
}
