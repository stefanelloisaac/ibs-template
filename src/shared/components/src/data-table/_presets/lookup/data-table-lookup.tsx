import { DataTable } from '../../_core/data-table';
import type { DataTableLookupProps } from './data-table-lookup.types';

export function DataTableLookup<TData>(props: DataTableLookupProps<TData>) {
  const { onRowClick, selectionState, loading, emptyMessage, ...rest } = props;

  return (
    <DataTable<TData>
      {...rest}
      ui={{ onRowClick, loading, emptyMessage }}
      selection={{ enabled: true, state: selectionState }}
      visibility
    />
  );
}
