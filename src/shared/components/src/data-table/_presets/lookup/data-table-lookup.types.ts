import type { DataTableBaseProps, DataTableRowSelection } from '../../_core/data-table.types';

export type DataTableLookupProps<TData> = Omit<
  DataTableBaseProps<TData>,
  'selection' | 'expansion' | 'virtualization' | 'visibility' | 'ui' | 'children'
> & {
  onRowClick?: (row: TData, index: number) => void;
  selectionState?: DataTableRowSelection;
  loading?: boolean;
  emptyMessage?: React.ReactNode;
};
