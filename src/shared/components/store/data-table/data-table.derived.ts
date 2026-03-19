import { resolveColumnType } from '../../src/data-table/_core/data-table.registry';
import type {
  DataTableColumnDef,
  DataTableFilteringProps,
  DataTablePaginationProps,
  DataTablePinnedOffset,
  DataTableRow,
  DataTableUtilityPinning,
  DataTableVirtualizationProps,
  DataTableVisibilityProps,
} from '../../src/data-table/_core/data-table.types';
import { buildRows, flattenRows } from '../../src/data-table/_features/data-table-expansion';
import { filterData } from '../../src/data-table/_features/data-table-filtering';
import { DEFAULT_PAGE_SIZE_OPTIONS, DEFAULT_ROW_HEIGHT } from '../../src/data-table/_features/data-table-pagination';
import { sortData } from '../../src/data-table/_features/data-table-sorting';
import type {
  DataTableSelectionSlice,
  DataTableStoreState,
  DataTableUISlice,
  InternalOverrides,
} from './data-table.types';

/**
 * @store computeDerived
 * @description Motor de estado derivado da tabela. Recebe o estado anterior e overrides opcionais,
 * executa o pipeline completo (filtrar → ordenar → montar arvore → achatar → paginar)
 * e retorna apenas os slices que mudaram (comparacao por referencia).
 *
 * Este e o unico ponto onde os dados processados da tabela sao calculados.
 * Actions nunca manipulam rows diretamente — elas atualizam estado interno e chamam `recompute`.
 */

export function computeDerived<TData>(
  prev: DataTableStoreState<TData>,
  overrides?: InternalOverrides<TData>,
): Partial<DataTableStoreState<TData>> {
  // Mescla overrides num estado virtual para leitura
  const config = overrides?._config ?? prev._config;
  const rawData = overrides?._rawData ?? prev._rawData;
  const allColumns = overrides?._allColumns ?? prev._allColumns;
  const getRowId = overrides?._getRowId ?? prev._getRowId;
  const sortingState_ = overrides?._sortingState ?? prev._sortingState;
  const filteringState_ = overrides?._filteringState ?? prev._filteringState;
  const paginationState_ = overrides?._paginationState ?? prev._paginationState;
  const selectionState_ = overrides?._selectionState ?? prev._selectionState;
  const expansionState_ = overrides?._expansionState ?? prev._expansionState;
  const visibilityState_ = overrides?._visibilityState ?? prev._visibilityState;
  const pinningState = overrides?._pinningState ?? prev._pinningState;
  const widths = overrides?._widths ?? prev._widths;
  const showFilters = overrides?._showFilters ?? prev._showFilters;

  const mode = config.mode ?? 'client';
  const getSubRows = config.expansion?.getSubRows;

  // Estado efetivo (controlado ?? interno)
  const sortingState = config.sorting?.state ?? sortingState_;
  const filterCfg = typeof config.filtering === 'object' ? (config.filtering as DataTableFilteringProps) : undefined;
  const filterState = filterCfg?.state ?? filteringState_;
  const expansionState = config.expansion?.state ?? expansionState_;
  const selectionState = config.selection?.state ?? selectionState_;
  const visCfg = typeof config.visibility === 'object' ? (config.visibility as DataTableVisibilityProps) : undefined;
  const visibilityState = visCfg?.state ?? visibilityState_;

  // MARK: Pipeline de Rows
  const filteringEnabled = !!config.filtering;
  const needsPipeline =
    rawData !== prev._rawData ||
    allColumns !== prev._allColumns ||
    sortingState !== prev.sorting.state ||
    filterState !== prev.filtering.state ||
    mode !== prev.ui.mode;

  const needsFlatten = needsPipeline || expansionState !== prev.expansion.state;

  const paginationEnabled = !!config.pagination;
  const pCfg = typeof config.pagination === 'object' ? (config.pagination as DataTablePaginationProps) : undefined;
  const pageSize = paginationState_.pageSize;
  const needsPagination = needsFlatten || paginationState_ !== prev._paginationState;

  let processedRows: DataTableRow<TData>[];
  let allFlatRows: DataTableRow<TData>[];

  if (needsFlatten) {
    const filteredData =
      mode === 'client' && filteringEnabled && Object.keys(filterState).length > 0
        ? filterData(rawData, filterState, allColumns)
        : rawData;
    const sortedData =
      mode === 'client' && sortingState.length > 0
        ? sortData(filteredData, sortingState, allColumns, resolveColumnType)
        : filteredData;
    processedRows = buildRows(sortedData, getRowId, getSubRows);
    allFlatRows = flattenRows(processedRows, expansionState);
  } else {
    processedRows = prev.rows.processed;
    allFlatRows = flattenRows(processedRows, expansionState);
  }

  // Paginação
  const pageCount =
    mode === 'server'
      ? (pCfg?.pageCount ?? 1)
      : paginationEnabled
        ? Math.max(1, Math.ceil(allFlatRows.length / pageSize))
        : 1;
  let pageIndex = paginationState_.pageIndex;
  if (pageIndex >= pageCount && pageCount > 0) pageIndex = pageCount - 1;
  if (pageIndex < 0) pageIndex = 0;
  const correctedPaginationState =
    pageIndex !== paginationState_.pageIndex ? { pageIndex, pageSize } : paginationState_;

  let flatRows: DataTableRow<TData>[];
  if (needsPagination || needsFlatten) {
    flatRows =
      paginationEnabled && mode === 'client'
        ? allFlatRows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
        : allFlatRows;
  } else {
    flatRows = prev.rows.flat;
  }

  const totalItems = mode === 'server' ? (pCfg?.totalItems ?? allFlatRows.length) : allFlatRows.length;
  const sizeOptions = pCfg?.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS;

  // MARK: Visibilidade
  const enableVisibility = !!config.visibility;
  const visibilityChanged = visibilityState !== prev.columns.visibility || allColumns !== prev._allColumns;
  const visibleColumns = visibilityChanged
    ? allColumns.filter((col) => visibilityState[col.id] !== false)
    : prev.columns.visible.length > 0
      ? prev.columns.visible
      : allColumns.filter((col) => visibilityState[col.id] !== false);

  // MARK: Pinning
  const selectionEnabled = config.selection?.enabled ?? false;
  const hasExpandable = !!getSubRows;

  const needsPinning =
    visibilityChanged ||
    pinningState !== prev.pinning.state ||
    widths !== prev.columns.widths ||
    selectionEnabled !== prev.selection.enabled ||
    hasExpandable !== prev.expansion.hasExpandable;

  let orderedColumns: DataTableColumnDef<TData>[];
  let offsets: Record<string, DataTablePinnedOffset>;
  let utility: DataTableUtilityPinning | null;

  if (needsPinning) {
    const left = visibleColumns.filter((c) => pinningState[c.id] === 'left');
    const center = visibleColumns.filter((c) => !pinningState[c.id]);
    const right = visibleColumns.filter((c) => pinningState[c.id] === 'right');
    orderedColumns = [...left, ...center, ...right];

    offsets = {};
    let leftOffset = 0;
    if (selectionEnabled) leftOffset += 40;
    if (hasExpandable) leftOffset += 40;
    for (const col of left) {
      offsets[col.id] = { side: 'left', offset: leftOffset, isEdge: false };
      leftOffset += widths[col.id] ?? col.size ?? 150;
    }
    if (left.length > 0) offsets[left[left.length - 1].id].isEdge = true;

    const rightPinned = [...right].reverse();
    let rightOffset = 0;
    for (const col of rightPinned) {
      offsets[col.id] = { side: 'right', offset: rightOffset, isEdge: false };
      rightOffset += widths[col.id] ?? col.size ?? 150;
    }
    if (rightPinned.length > 0) offsets[rightPinned[rightPinned.length - 1].id].isEdge = true;

    const hasLeftPinned = left.length > 0;
    utility = hasLeftPinned
      ? { checkbox: selectionEnabled ? 0 : null, expand: hasExpandable ? (selectionEnabled ? 40 : 0) : null }
      : null;
  } else {
    orderedColumns = prev.columns.visible;
    offsets = prev.pinning.offsets;
    utility = prev.pinning.utility;
  }

  // MARK: Seleção derivada
  const needsSelection =
    needsPagination ||
    needsFlatten ||
    selectionState !== prev.selection.state ||
    selectionEnabled !== prev.selection.enabled;

  let isAllSelected: boolean;
  let isSomeSelected: boolean;

  if (needsSelection) {
    const selectableRowIds = flatRows
      .filter((row) => (typeof selectionEnabled === 'function' ? selectionEnabled(row.original) : !!selectionEnabled))
      .map((row) => row.id);
    isAllSelected = selectableRowIds.length > 0 && selectableRowIds.every((id) => selectionState[id]);
    isSomeSelected = selectableRowIds.some((id) => selectionState[id]) && !isAllSelected;
  } else {
    isAllSelected = prev.selection.isAllSelected;
    isSomeSelected = prev.selection.isSomeSelected;
  }

  // MARK: Expansão derivada
  const subRowMap: Record<string, boolean> = {};
  if (needsFlatten) {
    const walk = (rows: DataTableRow<TData>[]) => {
      for (const row of rows) {
        subRowMap[row.id] = row.subRows.length > 0;
        walk(row.subRows);
      }
    };
    walk(processedRows);
  }

  // MARK: Virtualização
  const enableVirtualization = !!config.virtualization;
  const estimateRowHeight =
    (typeof config.virtualization === 'object'
      ? (config.virtualization as DataTableVirtualizationProps).estimateRowHeight
      : undefined) ?? DEFAULT_ROW_HEIGHT;

  // MARK: UI
  const uiConfig = config.ui ?? {};
  const loading = uiConfig.loading ?? false;
  const emptyMessage = uiConfig.emptyMessage ?? 'Nenhum registro encontrado.';
  const striped = config.striped ?? false;
  const onRowClick = uiConfig.onRowClick;

  // MARK: Resultado
  const result: Partial<DataTableStoreState<TData>> = {};
  if (overrides) Object.assign(result, overrides);
  if (correctedPaginationState !== paginationState_) result._paginationState = correctedPaginationState;
  if (needsFlatten) result._subRowMap = subRowMap;

  // columns
  if (
    allColumns !== prev.columns.all ||
    orderedColumns !== prev.columns.visible ||
    widths !== prev.columns.widths ||
    visibilityState !== prev.columns.visibility ||
    enableVisibility !== prev.columns.enableVisibility
  ) {
    result.columns = {
      ...prev.columns,
      all: allColumns,
      visible: orderedColumns,
      widths,
      visibility: visibilityState,
      enableVisibility,
    };
  }

  // rows
  if (processedRows !== prev.rows.processed || flatRows !== prev.rows.flat) {
    result.rows = { processed: processedRows, flat: flatRows };
  }

  // sorting
  if (sortingState !== prev.sorting.state) {
    result.sorting = { ...prev.sorting, state: sortingState };
  }

  // pagination
  if (
    paginationEnabled !== prev.pagination.enabled ||
    correctedPaginationState !== prev.pagination.state ||
    pageCount !== prev.pagination.pageCount ||
    totalItems !== prev.pagination.totalItems ||
    sizeOptions !== prev.pagination.sizeOptions
  ) {
    result.pagination = {
      ...prev.pagination,
      enabled: paginationEnabled,
      state: correctedPaginationState,
      pageCount,
      totalItems,
      sizeOptions,
    };
  }

  // selection
  if (
    selectionEnabled !== prev.selection.enabled ||
    selectionState !== prev.selection.state ||
    isAllSelected !== prev.selection.isAllSelected ||
    isSomeSelected !== prev.selection.isSomeSelected
  ) {
    result.selection = {
      ...prev.selection,
      enabled: selectionEnabled,
      state: selectionState,
      isAllSelected,
      isSomeSelected,
    } as DataTableSelectionSlice<TData>;
  }

  // expansion
  if (expansionState !== prev.expansion.state || hasExpandable !== prev.expansion.hasExpandable) {
    result.expansion = { ...prev.expansion, state: expansionState, hasExpandable };
  }

  // virtualization
  if (
    enableVirtualization !== prev.virtualization.enabled ||
    estimateRowHeight !== prev.virtualization.estimateRowHeight
  ) {
    result.virtualization = { enabled: enableVirtualization, estimateRowHeight };
  }

  // filtering
  if (
    filteringEnabled !== prev.filtering.enabled ||
    filterState !== prev.filtering.state ||
    showFilters !== prev.filtering.showFilters
  ) {
    result.filtering = { ...prev.filtering, enabled: filteringEnabled, state: filterState, showFilters };
  }

  // pinning
  if (offsets !== prev.pinning.offsets || utility !== prev.pinning.utility || pinningState !== prev.pinning.state) {
    result.pinning = { ...prev.pinning, offsets, utility, state: pinningState };
  }

  // ui
  if (
    loading !== prev.ui.loading ||
    emptyMessage !== prev.ui.emptyMessage ||
    mode !== prev.ui.mode ||
    striped !== prev.ui.striped ||
    onRowClick !== prev.ui.onRowClick
  ) {
    result.ui = { loading, emptyMessage, mode, striped, onRowClick } as DataTableUISlice<TData>;
  }

  return result;
}
