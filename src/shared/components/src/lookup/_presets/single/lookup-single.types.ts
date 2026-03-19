import type {
  DataTableColumnDef,
  DataTableFilteringProps,
  DataTablePaginationProps,
  DataTableSortingProps,
} from '../../../data-table';

export type LookupSingleProps<TData> = {
  data: TData[];
  columns: DataTableColumnDef<TData>[];
  getRowId?: (row: TData, index: number) => string;

  value?: TData | null;
  defaultValue?: TData | null;
  onValueChange?: (value: TData | null) => void;
  displayValue: (row: TData) => string;
  serializedValue?: (row: TData) => string;

  label?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
  name?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;

  dialogTitle?: string;
  dialogDescription?: string;

  pagination?: boolean | DataTablePaginationProps;
  sorting?: DataTableSortingProps;
  filtering?: boolean | DataTableFilteringProps;

  className?: string;
};
