import type {
  DataTableColumnDef,
  DataTableColumnType,
  DataTableFilterInputType,
  DataTableFilterValue,
} from '../_core/data-table.types';
import { getColumnValue } from './data-table-columns';

export function getFilterType(columnType?: DataTableColumnType): DataTableFilterInputType {
  switch (columnType) {
    case 'int':
    case 'float':
    case 'money':
    case 'percent':
      return 'range';
    case 'date':
    case 'datetime':
      return 'dateRange';
    case 'boolean':
    case 'status':
      return 'select';
    default:
      return 'text';
  }
}

export function filterData<TData>(
  data: TData[],
  columnFilters: Record<string, DataTableFilterValue>,
  allColumns: DataTableColumnDef<TData>[],
): TData[] {
  if (Object.keys(columnFilters).length === 0) return data;

  return data.filter((row) => {
    for (const [colId, filter] of Object.entries(columnFilters)) {
      const col = allColumns.find((c) => c.id === colId);
      if (!col) continue;

      const value = getColumnValue(row, col);
      const filterType = getFilterType(col.type);

      if (filterType === 'text' && filter.text) {
        if (
          !String(value ?? '')
            .toLowerCase()
            .includes(filter.text.toLowerCase())
        )
          return false;
      }

      if (filterType === 'range') {
        let num = Number(value) || 0;
        if (col.type === 'money') {
          const decimalPlaces = col.typeOptions?.decimalPlaces ?? 2;
          num = num / Math.pow(10, decimalPlaces);
        }
        if (filter.min != null && num < filter.min) return false;
        if (filter.max != null && num > filter.max) return false;
      }

      if (filterType === 'dateRange') {
        const date = value instanceof Date ? value : new Date(String(value ?? ''));
        if (isNaN(date.getTime())) return false;
        if (filter.from) {
          const fromDate = new Date(filter.from);
          if (date < fromDate) return false;
        }
        if (filter.to) {
          const toDate = new Date(filter.to);
          toDate.setHours(23, 59, 59, 999);
          if (date > toDate) return false;
        }
      }

      if (filterType === 'select' && filter.selected && filter.selected.length > 0) {
        if (!filter.selected.includes(!!value)) return false;
      }
    }
    return true;
  });
}
