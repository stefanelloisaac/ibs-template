import { createStore } from 'zustand';
import type {
  DataTableColumnDef,
  DataTableColumnPinning,
  DataTableFilteringProps,
  DataTablePaginationProps,
  DataTableVirtualizationProps,
  DataTableVisibilityProps,
} from '../../src/data-table/_core/data-table.types';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  DEFAULT_ROW_HEIGHT,
} from '../../src/data-table/_features/data-table-pagination';
import { createCellDataActions } from './actions/cell-data.actions';
import { createColumnsActions } from './actions/columns.actions';
import { createExpansionActions } from './actions/expansion.actions';
import { createFilteringActions } from './actions/filtering.actions';
import { createPaginationActions } from './actions/pagination.actions';
import { createSelectionActions } from './actions/selection.actions';
import { createSortingActions } from './actions/sorting.actions';
import { computeDerived } from './data-table.derived';
import type {
  DataTableCellDataSlice,
  DataTableColumnsSlice,
  DataTableConfig,
  DataTableSelectionSlice,
  DataTableStoreInit,
  DataTableStoreState,
  DataTableUISlice,
  InternalOverrides,
} from './data-table.types';

/**
 * @store createDataTableStore
 * @description Fabrica do store Zustand para o DataTable. Recebe dados, colunas e configuracao,
 * monta o estado inicial e compoe as actions de cada feature (sorting, filtering, pagination,
 * selection, expansion, pinning, cell-data). O metodo `_sync` e chamado pelo componente pai
 * via `useLayoutEffect` para atualizar dados e config sem recriar o store.
 *
 * @param init - { data, allColumns, getRowId, config }
 * @returns Store Zustand com estado completo da tabela
 */

// MARK: Re-exports
export type {
  DataTableCellDataSlice,
  DataTableColumnsSlice,
  DataTableConfig,
  DataTableExpansionSlice,
  DataTableFilteringSlice,
  DataTablePaginationSlice,
  DataTablePinningSlice,
  DataTableRowsSlice,
  DataTableSelectionSlice,
  DataTableSortingSlice,
  DataTableStoreInit,
  DataTableStoreState,
  DataTableUISlice,
  DataTableVirtualizationSlice,
  InternalOverrides,
} from './data-table.types';

// MARK: StoreApi
export type DataTableStoreApi<TData = unknown> = ReturnType<typeof createDataTableStore<TData>>;

// MARK: Factory
export function createDataTableStore<TData>(init: DataTableStoreInit<TData>) {
  const { data, allColumns, getRowId, config } = init;

  // Monta o Map inicial de cellData
  const dataMap = new Map<string, TData>();
  const order: string[] = [];
  data.forEach((row, i) => {
    const id = getRowId(row, i);
    dataMap.set(id, row);
    order.push(id);
  });

  // Resolve estado interno inicial a partir do config
  const filterCfg = typeof config.filtering === 'object' ? (config.filtering as DataTableFilteringProps) : undefined;
  const paginationCfg =
    typeof config.pagination === 'object' ? (config.pagination as DataTablePaginationProps) : undefined;
  const visCfg = typeof config.visibility === 'object' ? (config.visibility as DataTableVisibilityProps) : undefined;

  const initialExpansionState = (() => {
    if (config.expansion?.state) return config.expansion.state;
    if (config.expansion?.defaultExpanded) {
      const expanded: Record<string, boolean> = {};
      data.forEach((row, i) => {
        expanded[getRowId(row, i)] = true;
      });
      return expanded;
    }
    return {};
  })();

  const initialWidths: Record<string, number> = {};
  allColumns.forEach((c) => {
    if (c.size) initialWidths[c.id] = c.size;
  });

  const store = createStore<DataTableStoreState<TData>>()((set, get) => {
    // Recompute — único set() com apenas slices alterados
    const recompute = (overrides?: InternalOverrides<TData>) => {
      const prev = get();
      const result = computeDerived(prev, overrides);
      if (Object.keys(result).length > 0) set(result);
    };

    // Compor actions de cada feature
    const sorting = createSortingActions<TData>(get, recompute);
    const filtering = createFilteringActions<TData>(get, recompute);
    const pagination = createPaginationActions<TData>(get, recompute);
    const selection = createSelectionActions<TData>(get, recompute);
    const expansion = createExpansionActions<TData>(get, recompute);
    const columns = createColumnsActions<TData>(get, recompute);
    const cellData = createCellDataActions<TData>(set);

    // _sync — chamado pelo useLayoutEffect do componente pai
    const syncAction = (params: {
      config: DataTableConfig<TData>;
      data?: TData[];
      getRowId?: (row: TData, index: number) => string;
      allColumns?: DataTableColumnDef<TData>[];
    }) => {
      const prev = get();
      const overrides: InternalOverrides<TData> = { _config: params.config };

      // Atualiza cellData + rawData num único set()
      let cellDataUpdate: Partial<DataTableCellDataSlice<TData>> | undefined;
      if (params.data !== undefined) {
        const gri = params.getRowId ?? prev._getRowId;
        const newMap = new Map<string, TData>();
        const newOrder: string[] = [];
        params.data.forEach((row, i) => {
          const id = gri(row, i);
          newMap.set(id, row);
          newOrder.push(id);
        });
        cellDataUpdate = { _data: newMap, _order: newOrder, _version: prev.cellData._version + 1 };
        overrides._rawData = params.data;
        overrides._getRowId = gri;
      }

      // Atualiza colunas
      if (params.allColumns !== undefined) {
        const newWidths = { ...prev._widths };
        params.allColumns.forEach((c) => {
          if (c.size && !(c.id in newWidths)) newWidths[c.id] = c.size;
        });
        overrides._allColumns = params.allColumns;
        overrides._widths = newWidths;
      }

      // Computa derivados e mescla tudo num único set()
      const result = computeDerived(prev, overrides);

      if (cellDataUpdate) {
        result.cellData = { ...prev.cellData, ...cellDataUpdate };
      }

      if (Object.keys(result).length > 0) set(result);
    };

    // Estado inicial
    return {
      _config: config,
      _getRowId: getRowId,
      _sortingState: config.sorting?.state ?? [],
      _filteringState: filterCfg?.state ?? {},
      _paginationState: { pageIndex: 0, pageSize: paginationCfg?.pageSize ?? DEFAULT_PAGE_SIZE },
      _selectionState: config.selection?.state ?? {},
      _expansionState: initialExpansionState,
      _visibilityState: visCfg?.state ?? {},
      _pinningState: {} as DataTableColumnPinning,
      _widths: initialWidths,
      _showFilters: false,
      _rawData: data,
      _allColumns: allColumns,
      _subRowMap: {} as Record<string, boolean>,

      columns: {
        all: allColumns,
        visible: allColumns,
        widths: initialWidths,
        setWidth: columns.setWidth,
        visibility: visCfg?.state ?? {},
        toggleVisibility: columns.toggleVisibility,
        enableVisibility: !!config.visibility,
      } as DataTableColumnsSlice<TData>,

      rows: { processed: [], flat: [] },

      sorting: {
        state: config.sorting?.state ?? [],
        toggle: sorting.toggleSort,
        setSorting: sorting.setSorting,
        clearSort: sorting.clearSort,
      },

      pagination: {
        enabled: !!config.pagination,
        state: { pageIndex: 0, pageSize: paginationCfg?.pageSize ?? DEFAULT_PAGE_SIZE },
        pageCount: 1,
        totalItems: data.length,
        setPageIndex: pagination.setPageIndex,
        setPageSize: pagination.setPageSize,
        sizeOptions: paginationCfg?.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS,
      },

      selection: {
        enabled: config.selection?.enabled ?? false,
        state: config.selection?.state ?? {},
        toggle: selection.toggle,
        toggleAll: selection.toggleAll,
        isAllSelected: false,
        isSomeSelected: false,
      } as DataTableSelectionSlice<TData>,

      expansion: {
        state: initialExpansionState,
        toggle: expansion.toggle,
        hasSubRows: expansion.hasSubRows,
        hasExpandable: !!config.expansion?.getSubRows,
        expandAll: expansion.expandAll,
        collapseAll: expansion.collapseAll,
      },

      virtualization: {
        enabled: !!config.virtualization,
        estimateRowHeight:
          (typeof config.virtualization === 'object'
            ? (config.virtualization as DataTableVirtualizationProps).estimateRowHeight
            : undefined) ?? DEFAULT_ROW_HEIGHT,
      },

      filtering: {
        enabled: !!config.filtering,
        state: filterCfg?.state ?? {},
        setFilter: filtering.setFilter,
        clearAll: filtering.clearAll,
        showFilters: false,
        setShowFilters: filtering.setShowFilters,
      },

      pinning: {
        offsets: {},
        utility: null,
        state: {} as DataTableColumnPinning,
        pin: columns.pin,
        unpin: columns.unpin,
      },

      ui: {
        loading: config.ui?.loading ?? false,
        emptyMessage: config.ui?.emptyMessage ?? 'Nenhum registro encontrado.',
        mode: config.mode ?? 'client',
        striped: config.striped ?? false,
        onRowClick: config.ui?.onRowClick,
      } as DataTableUISlice<TData>,

      cellData: {
        _data: dataMap,
        _order: order,
        _version: 0,
        getRow: (rowId: string) => get().cellData._data.get(rowId),
        getCellValue: (rowId: string, columnId: string) => {
          const row = get().cellData._data.get(rowId);
          if (!row) return undefined;
          return (row as Record<string, unknown>)[columnId];
        },
        getAllRows: () => get().cellData._order.map((id) => get().cellData._data.get(id)!),
        getRowIds: () => get().cellData._order,
        updateCell: cellData.updateCell,
        updateRow: cellData.updateRow,
      },

      _recompute: () => recompute(),
      _sync: syncAction,
    };
  });

  // Recompute inicial para popular valores derivados
  store.getState()._recompute();

  return store;
}
