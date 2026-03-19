import type { DataTableColumnDef, DataTableRow } from '../../_core/data-table.types';

export type DataTableCellProps<TData = unknown> = {
  row: DataTableRow<TData>;
  column: DataTableColumnDef<TData>;
};
