import type { DataTableColumnDef, DataTableColumnType, DataTableColumnTypeConfig } from '../_core/data-table.types';
import { getColumnValue } from './data-table-columns';

export function sortData<TData>(
  data: TData[],
  sorting: { id: string; desc: boolean }[],
  allColumns: DataTableColumnDef<TData>[],
  resolveColumnType: (type: DataTableColumnType) => DataTableColumnTypeConfig,
): TData[] {
  if (sorting.length === 0) return data;

  const sorted = [...data];
  sorted.sort((a, b) => {
    for (const sort of sorting) {
      const col = allColumns.find((c) => c.id === sort.id);
      if (!col) continue;

      let result: number;
      if (col.sortingFn) {
        result = col.sortingFn(a, b);
      } else {
        const valA = getColumnValue(a, col);
        const valB = getColumnValue(b, col);
        const typeConfig = col.type ? resolveColumnType(col.type) : null;
        result = typeConfig ? typeConfig.sort(valA, valB) : String(valA ?? '').localeCompare(String(valB ?? ''));
      }

      if (result !== 0) return sort.desc ? -result : result;
    }
    return 0;
  });
  return sorted;
}
