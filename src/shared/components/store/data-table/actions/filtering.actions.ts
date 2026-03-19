import type { DataTableFilterValue, DataTableFilteringProps } from '../../../src/data-table/_core/data-table.types';
import type { Recompute, StoreGet } from '../data-table.types';

/**
 * @store createFilteringActions
 * @description Actions de filtragem por coluna. `setFilter` define o valor de filtro para uma coluna,
 * `clearAll` remove todos os filtros, `setShowFilters` controla a exibicao do painel de filtros.
 * Suporta modo controlado/nao-controlado.
 */

export function createFilteringActions<TData>(get: StoreGet<TData>, recompute: Recompute<TData>) {
  const setFilter = (columnId: string, value: DataTableFilterValue | null) => {
    const s = get();
    const cfg = s._config;
    const fCfg = typeof cfg.filtering === 'object' ? (cfg.filtering as DataTableFilteringProps) : undefined;
    const isControlled = fCfg?.state !== undefined;
    const current = fCfg?.state ?? s._filteringState;
    const next = { ...current };
    if (value === null) delete next[columnId];
    else next[columnId] = value;
    if (isControlled) {
      fCfg?.onChange?.(next);
    } else {
      fCfg?.onChange?.(next);
      recompute({ _filteringState: next });
    }
  };

  const clearAll = () => {
    const cfg = get()._config;
    const fCfg = typeof cfg.filtering === 'object' ? (cfg.filtering as DataTableFilteringProps) : undefined;
    const isControlled = fCfg?.state !== undefined;
    if (isControlled) {
      fCfg?.onChange?.({});
    } else {
      fCfg?.onChange?.({});
      recompute({ _filteringState: {} });
    }
  };

  const setShowFilters = (show: boolean) => {
    recompute({ _showFilters: show });
  };

  return { setFilter, clearAll, setShowFilters };
}
