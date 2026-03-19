import type {
  DataTableColumnDef,
  DataTableColumnFilters,
  DataTableColumnPinning,
  DataTableColumnVisibility,
  DataTableExpansionProps,
  DataTableFilterValue,
  DataTableFilteringProps,
  DataTableMode,
  DataTablePaginationProps,
  DataTablePaginationState,
  DataTablePinnedOffset,
  DataTableRow,
  DataTableRowSelection,
  DataTableSelectionProps,
  DataTableSortingProps,
  DataTableSortingState,
  DataTableUIProps,
  DataTableUtilityPinning,
  DataTableVirtualizationProps,
  DataTableVisibilityProps,
} from '../../src/data-table/_core/data-table.types';

/**
 * @store DataTableStoreState
 * @description Tipos do store Zustand do DataTable. Organizado em slices por feature:
 * columns, rows, sorting, pagination, selection, expansion, virtualization, filtering, pinning, ui, cellData.
 * Cada slice contem estado derivado (somente leitura) e actions para mutacao.
 * Campos prefixados com `_` sao estado interno — nao devem ser consumidos diretamente.
 */

// MARK: Config
export type DataTableConfig<TData> = {
  mode?: DataTableMode;
  sorting?: DataTableSortingProps;
  filtering?: boolean | DataTableFilteringProps;
  pagination?: boolean | DataTablePaginationProps;
  selection?: DataTableSelectionProps<TData>;
  expansion?: DataTableExpansionProps<TData>;
  virtualization?: boolean | DataTableVirtualizationProps;
  visibility?: boolean | DataTableVisibilityProps;
  ui?: DataTableUIProps<TData>;
  striped?: boolean;
};

// MARK: Tipos dos Slices
export type DataTableColumnsSlice<TData = unknown> = {
  all: DataTableColumnDef<TData>[];
  visible: DataTableColumnDef<TData>[];
  widths: Record<string, number>;
  setWidth: (columnId: string, width: number) => void;
  visibility: DataTableColumnVisibility;
  toggleVisibility: (columnId: string) => void;
  enableVisibility: boolean;
};

export type DataTableRowsSlice<TData = unknown> = {
  processed: DataTableRow<TData>[];
  flat: DataTableRow<TData>[];
};

export type DataTableSortingSlice = {
  state: DataTableSortingState;
  toggle: (columnId: string, multi: boolean) => void;
  setSorting: (columnId: string, desc: boolean) => void;
  clearSort: (columnId: string) => void;
};

export type DataTablePaginationSlice = {
  enabled: boolean;
  state: DataTablePaginationState;
  pageCount: number;
  totalItems: number;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  sizeOptions: number[];
};

export type DataTableSelectionSlice<TData = unknown> = {
  enabled: boolean | ((row: TData) => boolean);
  state: DataTableRowSelection;
  toggle: (rowId: string) => void;
  toggleAll: () => void;
  isAllSelected: boolean;
  isSomeSelected: boolean;
};

export type DataTableExpansionSlice = {
  state: Record<string, boolean>;
  toggle: (rowId: string) => void;
  hasSubRows: (rowId: string) => boolean;
  hasExpandable: boolean;
  expandAll: () => void;
  collapseAll: () => void;
};

export type DataTableVirtualizationSlice = {
  enabled: boolean;
  estimateRowHeight: number;
};

export type DataTableFilteringSlice = {
  enabled: boolean;
  state: DataTableColumnFilters;
  setFilter: (columnId: string, value: DataTableFilterValue | null) => void;
  clearAll: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
};

export type DataTablePinningSlice = {
  offsets: Record<string, DataTablePinnedOffset>;
  utility: DataTableUtilityPinning | null;
  state: DataTableColumnPinning;
  pin: (columnId: string, side: 'left' | 'right') => void;
  unpin: (columnId: string) => void;
};

export type DataTableUISlice<TData = unknown> = {
  loading: boolean;
  emptyMessage: React.ReactNode;
  mode: DataTableMode;
  striped: boolean;
  onRowClick?: (row: TData, index: number) => void;
};

export type DataTableCellDataSlice<TData = unknown> = {
  _data: Map<string, TData>;
  _order: string[];
  _version: number;
  getRow: (rowId: string) => TData | undefined;
  getCellValue: (rowId: string, columnId: string) => unknown;
  getAllRows: () => TData[];
  getRowIds: () => string[];
  updateCell: (rowId: string, columnId: string, value: unknown) => void;
  updateRow: (rowId: string, partial: Partial<TData>) => void;
};

// MARK: Estado Combinado da Store
export type DataTableStoreState<TData = unknown> = {
  _config: DataTableConfig<TData>;
  _getRowId: (row: TData, index: number) => string;
  _sortingState: DataTableSortingState;
  _filteringState: DataTableColumnFilters;
  _paginationState: DataTablePaginationState;
  _selectionState: DataTableRowSelection;
  _expansionState: Record<string, boolean>;
  _visibilityState: DataTableColumnVisibility;
  _pinningState: DataTableColumnPinning;
  _widths: Record<string, number>;
  _showFilters: boolean;
  _rawData: TData[];
  _allColumns: DataTableColumnDef<TData>[];
  _subRowMap: Record<string, boolean>;
  columns: DataTableColumnsSlice<TData>;
  rows: DataTableRowsSlice<TData>;
  sorting: DataTableSortingSlice;
  pagination: DataTablePaginationSlice;
  selection: DataTableSelectionSlice<TData>;
  expansion: DataTableExpansionSlice;
  virtualization: DataTableVirtualizationSlice;
  filtering: DataTableFilteringSlice;
  pinning: DataTablePinningSlice;
  ui: DataTableUISlice<TData>;
  cellData: DataTableCellDataSlice<TData>;
  _recompute: () => void;
  _sync: (params: {
    config: DataTableConfig<TData>;
    data?: TData[];
    getRowId?: (row: TData, index: number) => string;
    allColumns?: DataTableColumnDef<TData>[];
  }) => void;
};

// MARK: Init
export type DataTableStoreInit<TData> = {
  data: TData[];
  allColumns: DataTableColumnDef<TData>[];
  getRowId: (row: TData, index: number) => string;
  config: DataTableConfig<TData>;
};

// MARK: Internal Overrides
export type InternalOverrides<TData> = {
  _config?: DataTableConfig<TData>;
  _sortingState?: DataTableSortingState;
  _filteringState?: DataTableColumnFilters;
  _paginationState?: DataTablePaginationState;
  _selectionState?: DataTableRowSelection;
  _expansionState?: Record<string, boolean>;
  _visibilityState?: DataTableColumnVisibility;
  _pinningState?: DataTableColumnPinning;
  _widths?: Record<string, number>;
  _showFilters?: boolean;
  _rawData?: TData[];
  _allColumns?: DataTableColumnDef<TData>[];
  _getRowId?: (row: TData, index: number) => string;
};

// MARK: Tipos Utilitários
export type StoreGet<TData> = () => DataTableStoreState<TData>;

export type Recompute<TData> = (overrides?: InternalOverrides<TData>) => void;

export type StoreSet<TData> = (
  partial:
    | DataTableStoreState<TData>
    | Partial<DataTableStoreState<TData>>
    | ((state: DataTableStoreState<TData>) => DataTableStoreState<TData> | Partial<DataTableStoreState<TData>>),
) => void;
