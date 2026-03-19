import type { DataTablePaginationProps } from '../../../src/data-table/_core/data-table.types';
import type { Recompute, StoreGet } from '../data-table.types';

/**
 * @store createPaginationActions
 * @description Actions de paginacao. `setPageIndex` navega para uma pagina (com guarda de limites),
 * `setPageSize` altera o tamanho da pagina e sempre reseta para a pagina 0.
 */

export function createPaginationActions<TData>(get: StoreGet<TData>, recompute: Recompute<TData>) {
  const setPageIndex = (index: number) => {
    const s = get();
    const { pageCount } = s.pagination;
    if (index < 0 || index >= pageCount) return;

    const cfg = s._config;
    const pCfg = typeof cfg.pagination === 'object' ? (cfg.pagination as DataTablePaginationProps) : undefined;
    const next = { ...s._paginationState, pageIndex: index };
    pCfg?.onChange?.(next);
    recompute({ _paginationState: next });
  };

  const setPageSize = (size: number) => {
    const cfg = get()._config;
    const pCfg = typeof cfg.pagination === 'object' ? (cfg.pagination as DataTablePaginationProps) : undefined;
    const next = { pageIndex: 0, pageSize: size };
    pCfg?.onChange?.(next);
    recompute({ _paginationState: next });
  };

  return { setPageIndex, setPageSize };
}
