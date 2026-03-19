import type { DataTableColumnDef } from '../_core/data-table.types';

export function defaultGetRowId<TData>(row: TData, index: number): string {
  if (row && typeof row === 'object' && 'id' in row) return String((row as Record<string, unknown>).id);
  return String(index);
}

export function getColumnValue<TData>(row: TData, col: DataTableColumnDef<TData>): unknown {
  if (col.accessorFn) return col.accessorFn(row);
  if (col.accessorKey) return (row as Record<string, unknown>)[col.accessorKey];
  return undefined;
}
