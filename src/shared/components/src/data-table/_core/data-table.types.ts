import type { VariantProps } from 'tailwind-variants';
import type { dataTableVariants } from './data-table.variants';

// MARK: Primitivos
export type DataTableMode = 'client' | 'server';

export type DataTableColumnType =
  | 'text'
  | 'int'
  | 'float'
  | 'money'
  | 'percent'
  | 'date'
  | 'datetime'
  | 'time'
  | 'tel'
  | 'docs'
  | 'boolean'
  | 'status';

export type DataTableFilterInputType = 'text' | 'range' | 'dateRange' | 'select';

// MARK: Registry
export type DataTableTypeOptions = {
  locale?: string;
  currency?: string;
  decimalPlaces?: number;
  thousandSeparator?: boolean;
  unit?: string;
  telLocale?: 'pt-BR' | 'en-US';
  mask?: string;
  trueLabel?: string;
  falseLabel?: string;
  dateLocale?: string;
};

export type DataTableColumnTypeConfig = {
  format: (value: unknown, options?: DataTableTypeOptions) => string;
  render?: (value: unknown, options?: DataTableTypeOptions) => React.ReactNode;
  align: 'left' | 'center' | 'right';
  sort: (a: unknown, b: unknown) => number;
};

// MARK: Definição de coluna
export type DataTableCellContext<TData> = {
  getValue: () => unknown;
  row: { original: TData; index: number; id: string };
  column: { id: string };
};

export type DataTableColumnDef<TData> = {
  id: string;
  header: React.ReactNode;
  accessorKey?: keyof TData & string;
  accessorFn?: (row: TData) => unknown;
  type?: DataTableColumnType;
  typeOptions?: DataTableTypeOptions;
  cell?: (ctx: DataTableCellContext<TData>) => React.ReactNode;
  footer?: React.ReactNode;
  sortable?: boolean;
  sortingFn?: (a: TData, b: TData) => number;
  align?: 'left' | 'center' | 'right';
  size?: number;
  minSize?: number;
  maxSize?: number;
  enableResizing?: boolean;
  enableFilter?: boolean;
  meta?: Record<string, unknown>;
};

// MARK: Linha
export type DataTableRow<TData> = {
  id: string;
  original: TData;
  index: number;
  depth: number;
  subRows: DataTableRow<TData>[];
  parentId: string | null;
};

// MARK: Estado
export type DataTableSortItem = {
  id: string;
  desc: boolean;
};

export type DataTableSortingState = DataTableSortItem[];

export type DataTablePaginationState = {
  pageIndex: number;
  pageSize: number;
};

export type DataTableRowSelection = Record<string, boolean>;

export type DataTableFilterValue = {
  text?: string;
  min?: number | null;
  max?: number | null;
  from?: string | null;
  to?: string | null;
  selected?: unknown[];
};

export type DataTableColumnFilters = Record<string, DataTableFilterValue>;

export type DataTableColumnVisibility = Record<string, boolean>;

export type DataTableColumnPinning = Record<string, 'left' | 'right'>;

// MARK: Props de features
export type DataTablePaginationProps = {
  pageSize?: number;
  pageSizeOptions?: number[];
  pageCount?: number;
  totalItems?: number;
  onChange?: (state: DataTablePaginationState) => void;
};

export type DataTableSortingProps = {
  state?: DataTableSortingState;
  onChange?: (sorting: DataTableSortingState) => void;
  multiSort?: boolean;
};

export type DataTableSelectionProps<TData> = {
  enabled?: boolean | ((row: TData) => boolean);
  state?: DataTableRowSelection;
  onChange?: (selection: DataTableRowSelection) => void;
};

export type DataTableExpansionProps<TData> = {
  getSubRows?: (row: TData) => TData[] | undefined;
  state?: Record<string, boolean>;
  onChange?: (expanded: Record<string, boolean>) => void;
  defaultExpanded?: boolean;
};

export type DataTableVirtualizationProps = {
  estimateRowHeight?: number;
};

export type DataTableFilteringProps = {
  state?: DataTableColumnFilters;
  onChange?: (filters: DataTableColumnFilters) => void;
};

export type DataTableVisibilityProps = {
  state?: DataTableColumnVisibility;
  onChange?: (visibility: DataTableColumnVisibility) => void;
};

// MARK: Componente
export type DataTableUIProps<TData> = {
  loading?: boolean;
  emptyMessage?: React.ReactNode;
  onRowClick?: (row: TData, index: number) => void;
};

export type DataTableBaseProps<TData> = Omit<React.ComponentProps<'div'>, 'children' | 'ref'> &
  VariantProps<typeof dataTableVariants> & {
    data: TData[];
    columns?: DataTableColumnDef<TData>[];
    children?: React.ReactNode;
    mode?: DataTableMode;
    getRowId?: (row: TData, index: number) => string;

    ui?: DataTableUIProps<TData>;

    pagination?: boolean | DataTablePaginationProps;
    sorting?: DataTableSortingProps;
    selection?: DataTableSelectionProps<TData>;
    expansion?: DataTableExpansionProps<TData>;
    virtualization?: boolean | DataTableVirtualizationProps;
    filtering?: boolean | DataTableFilteringProps;
    visibility?: boolean | DataTableVisibilityProps;

    ref?: React.Ref<DataTableRef<TData>>;
  };

export type DataTableRef<TData> = {
  updateCell: (rowId: string, columnId: string, value: unknown) => void;
  updateRow: (rowId: string, data: Partial<TData>) => void;
  getData: () => TData[];
  scrollToRow: (rowId: string) => void;
};

// MARK: Interno
export type DataTablePinnedOffset = {
  side: 'left' | 'right';
  offset: number;
  isEdge: boolean;
};

export type DataTableUtilityPinning = {
  checkbox: number | null;
  expand: number | null;
};
