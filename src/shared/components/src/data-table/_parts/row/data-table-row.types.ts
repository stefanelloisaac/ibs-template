import type { DataTableRow } from '../../_core/data-table.types';

export type DataTableRowProps<TData = unknown> = {
  row: DataTableRow<TData>;
};
