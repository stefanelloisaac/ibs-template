import { memo } from 'react';
import { useCellValue, useDataTablePinning } from '../../../../store/data-table/use-data-table';
import { Badge } from '../../../badge/_core/badge';
import { IconCheckbox } from '../../../icon/_presets/checkbox/icon-checkbox';
import { resolveColumnType } from '../../_core/data-table.registry';
import { getPinClassName } from '../../_features/data-table-pinning';
import type { DataTableCellProps } from './data-table-cell.types';
import { dataTableCellVariants } from './data-table-cell.variants';

function DataTableCellInner(props: DataTableCellProps) {
  const { row, column } = props;

  const pinning = useDataTablePinning();

  const accessorKey = column.accessorKey as string | undefined;
  const storeValue = useCellValue(row.id, accessorKey ?? column.id);
  const rawValue =
    storeValue !== undefined
      ? storeValue
      : accessorKey
        ? (row.original as Record<string, unknown>)[accessorKey]
        : undefined;
  const value = column.accessorFn ? column.accessorFn(row.original) : rawValue;

  const typeConfig = column.type ? resolveColumnType(column.type) : null;
  const align = column.align ?? typeConfig?.align ?? 'left';
  const pin = pinning.offsets[column.id];

  let content: React.ReactNode;

  if (column.cell) {
    content = column.cell({
      getValue: () => value,
      row: { original: row.original, index: row.index, id: row.id },
      column: { id: column.id },
    });
  } else if (column.type === 'boolean') {
    content = <IconCheckbox checked={!!value} size='sm' className={value ? 'text-success' : 'text-muted-foreground'} />;
  } else if (column.type === 'status') {
    const label = typeConfig?.format(value, column.typeOptions) ?? '';
    content = <Badge intent={value ? 'success' : 'default'}>{label}</Badge>;
  } else if (typeConfig) {
    content = typeConfig.format(value, column.typeOptions);
  } else {
    content = value != null ? String(value) : '';
  }

  const styles = dataTableCellVariants({ align, sublevel: row.depth > 0 });
  const pinClass = getPinClassName(pin, 1, 'bg-inherit');

  return (
    <td
      data-slot='data-table-cell'
      className={`${styles.root()} ${pinClass}`}
      style={pin ? { [pin.side]: pin.offset } : undefined}
    >
      <div className={styles.content()}>
        <span>{content}</span>
      </div>
    </td>
  );
}

export const DataTableCell = memo(DataTableCellInner);
