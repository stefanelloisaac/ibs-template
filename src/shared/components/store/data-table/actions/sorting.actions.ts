import type { DataTableSortingState } from '../../../src/data-table/_core/data-table.types';
import type { Recompute, StoreGet } from '../data-table.types';

/**
 * @store createSortingActions
 * @description Actions de ordenacao. `toggleSort` cicla entre asc → desc → sem ordenacao.
 * `setSorting` forca uma ordenacao especifica. `clearSort` remove a ordenacao de uma coluna.
 * Suporta multi-sort (quando `config.sorting.multiSort` e true) e modo controlado/nao-controlado.
 */

export function createSortingActions<TData>(get: StoreGet<TData>, recompute: Recompute<TData>) {
  const toggleSort = (columnId: string, multi: boolean) => {
    const s = get();
    const cfg = s._config;
    const isControlled = cfg.sorting?.state !== undefined;
    const current = cfg.sorting?.state ?? s._sortingState;

    const existing = current.find((x: { id: string }) => x.id === columnId);
    let next: DataTableSortingState;
    if (!existing) {
      const newSort = { id: columnId, desc: false };
      next = multi && cfg.sorting?.multiSort ? [...current, newSort] : [newSort];
    } else if (!existing.desc) {
      next = current.map((x: { id: string; desc: boolean }) => (x.id === columnId ? { ...x, desc: true } : x));
    } else {
      next = current.filter((x: { id: string }) => x.id !== columnId);
    }

    if (isControlled) {
      cfg.sorting?.onChange?.(next);
    } else {
      cfg.sorting?.onChange?.(next);
      recompute({ _sortingState: next });
    }
  };

  const setSorting = (columnId: string, desc: boolean) => {
    const cfg = get()._config;
    const isControlled = cfg.sorting?.state !== undefined;
    const next: DataTableSortingState = [{ id: columnId, desc }];
    if (isControlled) {
      cfg.sorting?.onChange?.(next);
    } else {
      cfg.sorting?.onChange?.(next);
      recompute({ _sortingState: next });
    }
  };

  const clearSort = (columnId: string) => {
    const s = get();
    const cfg = s._config;
    const isControlled = cfg.sorting?.state !== undefined;
    const current = cfg.sorting?.state ?? s._sortingState;
    const next = current.filter((x: { id: string }) => x.id !== columnId);
    if (isControlled) {
      cfg.sorting?.onChange?.(next);
    } else {
      cfg.sorting?.onChange?.(next);
      recompute({ _sortingState: next });
    }
  };

  return { toggleSort, setSorting, clearSort };
}
