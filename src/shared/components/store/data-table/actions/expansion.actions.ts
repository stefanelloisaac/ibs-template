import type { DataTableRow } from '../../../src/data-table/_core/data-table.types';
import type { Recompute, StoreGet } from '../data-table.types';

/**
 * @store createExpansionActions
 * @description Actions de expansao de linhas (sub-rows/arvore). `toggle` expande/colapsa uma linha,
 * `expandAll` percorre toda a arvore de rows processadas, `collapseAll` reseta para vazio.
 * Suporta modo controlado/nao-controlado.
 */

export function createExpansionActions<TData>(get: StoreGet<TData>, recompute: Recompute<TData>) {
  const toggle = (rowId: string) => {
    const s = get();
    const cfg = s._config;
    const isControlled = cfg.expansion?.state !== undefined;
    const current = cfg.expansion?.state ?? s._expansionState;
    const next = { ...current, [rowId]: !current[rowId] };
    if (!next[rowId]) delete next[rowId];
    if (isControlled) {
      cfg.expansion?.onChange?.(next);
    } else {
      cfg.expansion?.onChange?.(next);
      recompute({ _expansionState: next });
    }
  };

  const expandAll = () => {
    const s = get();
    const cfg = s._config;
    const isControlled = cfg.expansion?.state !== undefined;
    const next: Record<string, boolean> = {};
    const walk = (rows: DataTableRow<TData>[]) => {
      for (const row of rows) {
        if (row.subRows.length > 0) {
          next[row.id] = true;
          walk(row.subRows);
        }
      }
    };
    walk(s.rows.processed);
    if (isControlled) {
      cfg.expansion?.onChange?.(next);
    } else {
      cfg.expansion?.onChange?.(next);
      recompute({ _expansionState: next });
    }
  };

  const collapseAll = () => {
    const cfg = get()._config;
    const isControlled = cfg.expansion?.state !== undefined;
    if (isControlled) {
      cfg.expansion?.onChange?.({});
    } else {
      cfg.expansion?.onChange?.({});
      recompute({ _expansionState: {} });
    }
  };

  const hasSubRows = (rowId: string): boolean => !!get()._subRowMap[rowId];

  return { toggle, expandAll, collapseAll, hasSubRows };
}
