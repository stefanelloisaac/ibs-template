import type {
  DataTableColumnDef,
  DataTableFilteringProps,
  DataTablePaginationProps,
  DataTableSortingProps,
} from '../../../data-table';

export type LookupMultipleProps<TData> = {
  data: TData[];
  columns: DataTableColumnDef<TData>[];
  getRowId?: (row: TData, index: number) => string;

  value?: TData[];
  defaultValue?: TData[];
  onValueChange?: (value: TData[]) => void;
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
