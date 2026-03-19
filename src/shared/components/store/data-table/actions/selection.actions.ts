import type { Recompute, StoreGet } from '../data-table.types';

/**
 * @store createSelectionActions
 * @description Actions de selecao de linhas. `toggle` seleciona/deseleciona uma linha,
 * `toggleAll` seleciona todas as linhas selecionaveis da pagina atual (ou deseleciona se
 * todas ja estao selecionadas). Respeita a funcao `enabled` por linha quando configurada.
 * Suporta modo controlado/nao-controlado.
 */

export function createSelectionActions<TData>(get: StoreGet<TData>, recompute: Recompute<TData>) {
  const toggle = (rowId: string) => {
    const s = get();
    const cfg = s._config;
    const isControlled = cfg.selection?.state !== undefined;
    const current = cfg.selection?.state ?? s._selectionState;
    const next = { ...current, [rowId]: !current[rowId] };
    if (!next[rowId]) delete next[rowId];
    if (isControlled) {
      cfg.selection?.onChange?.(next);
    } else {
      cfg.selection?.onChange?.(next);
      recompute({ _selectionState: next });
    }
  };

  const toggleAll = () => {
    const s = get();
    const cfg = s._config;
    const isControlled = cfg.selection?.state !== undefined;
    const current = cfg.selection?.state ?? s._selectionState;
    const selEnabled = cfg.selection?.enabled ?? false;
    const next = { ...current };

    const selectableRowIds = s.rows.flat
      .filter((row) => (typeof selEnabled === 'function' ? selEnabled(row.original) : !!selEnabled))
      .map((row) => row.id);

    if (s.selection.isAllSelected) {
      selectableRowIds.forEach((id) => delete next[id]);
    } else {
      selectableRowIds.forEach((id) => {
        next[id] = true;
      });
    }

    if (isControlled) {
      cfg.selection?.onChange?.(next);
    } else {
      cfg.selection?.onChange?.(next);
      recompute({ _selectionState: next });
    }
  };

  return { toggle, toggleAll };
}
