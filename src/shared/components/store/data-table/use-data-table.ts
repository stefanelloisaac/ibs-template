/**
 * @hook useDataTable*
 * @description Hooks pre-construidos para consumir slices individuais do store da tabela.
 * Cada hook seleciona exatamente um slice, evitando re-renders desnecessarios.
 * `useCellValue` e especial — subscreve ao valor de uma unica celula usando selector memoizado.
 *
 * @usage DataTableHeader, DataTableBody, DataTableToolbar, DataTablePagination, etc.
 */

import { useCallback } from 'react';
import { useStore } from 'zustand';
import { useDataTable, useDataTableStoreApi } from '../../providers/data-table.provider';
import type { DataTableStoreState } from '../data-table/data-table.store';

export const useDataTableColumns = () => useDataTable((s) => s.columns);
export const useDataTableRows = () => useDataTable((s) => s.rows);
export const useDataTableSorting = () => useDataTable((s) => s.sorting);
export const useDataTablePagination = () => useDataTable((s) => s.pagination);
export const useDataTableSelection = () => useDataTable((s) => s.selection);
export const useDataTableExpansion = () => useDataTable((s) => s.expansion);
export const useDataTableVirtualization = () => useDataTable((s) => s.virtualization);
export const useDataTableFiltering = () => useDataTable((s) => s.filtering);
export const useDataTablePinning = () => useDataTable((s) => s.pinning);
export const useDataTableUI = () => useDataTable((s) => s.ui);

export function useCellValue(rowId: string, columnId: string): unknown {
  const store = useDataTableStoreApi();

  const selector = useCallback(
    (state: DataTableStoreState) => {
      const row = state.cellData._data.get(rowId);
      if (!row) return undefined;
      return (row as Record<string, unknown>)[columnId];
    },
    [rowId, columnId],
  );

  return useStore(store, selector);
}
