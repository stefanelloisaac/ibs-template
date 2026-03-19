import type { DataTableRow } from '../_core/data-table.types';

export function buildRows<TData>(
  items: TData[],
  getRowId: (row: TData, index: number) => string,
  getSubRows?: (row: TData) => TData[] | undefined,
  parentId: string | null = null,
  depth: number = 0,
): DataTableRow<TData>[] {
  return items.map((item, i) => {
    const id = getRowId(item, i);
    const children = getSubRows?.(item) ?? [];
    const subRows = children.length > 0 ? buildRows(children, getRowId, getSubRows, id, depth + 1) : [];
    return { id, original: item, index: i, depth, subRows, parentId };
  });
}

export function flattenRows<TData>(
  rows: DataTableRow<TData>[],
  expandedRows: Record<string, boolean>,
): DataTableRow<TData>[] {
  const result: DataTableRow<TData>[] = [];
  for (const row of rows) {
    result.push(row);
    if (row.subRows.length > 0 && expandedRows[row.id]) {
      result.push(...flattenRows(row.subRows, expandedRows));
    }
  }
  return result;
}
