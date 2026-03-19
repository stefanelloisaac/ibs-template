import { memo, useCallback } from 'react';
import {
  useDataTableColumns,
  useDataTableExpansion,
  useDataTablePinning,
  useDataTableSelection,
  useDataTableUI,
} from '../../../../store/data-table/use-data-table';
import { IconCheckbox } from '../../../icon/_presets/checkbox/icon-checkbox';
import { IconChevronRight } from '../../../icon/_presets/chevron-right/icon-chevron-right';
import { getUtilityPinClassName } from '../../_features/data-table-pinning';
import { DataTableCell } from '../cell/data-table-cell';
import type { DataTableRowProps } from './data-table-row.types';
import { dataTableRowVariants } from './data-table-row.variants';

function DataTableRowInner(props: DataTableRowProps) {
  const { row } = props;

  const columns = useDataTableColumns();
  const ui = useDataTableUI();
  const selection = useDataTableSelection();
  const expansion = useDataTableExpansion();
  const pinning = useDataTablePinning();

  const isSelected = !!selection.state[row.id];
  const isExpanded = !!expansion.state[row.id];
  const canExpand = expansion.hasSubRows(row.id);
  const isSelectable = typeof selection.enabled === 'function' ? selection.enabled(row.original) : !!selection.enabled;

  const utilityPinClass = getUtilityPinClassName(pinning.utility, 1, 'bg-inherit');

  const handleClick = useCallback(() => {
    ui.onRowClick?.(row.original, row.index);
  }, [ui, row.original, row.index]);

  const handleCheckbox = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      selection.toggle(row.id);
    },
    [selection, row.id],
  );

  const handleExpand = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      expansion.toggle(row.id);
    },
    [expansion, row.id],
  );

  const styles = dataTableRowVariants({
    clickable: !!ui.onRowClick,
    selected: isSelected,
    striped: ui.striped,
    sublevel: row.depth > 0,
  });

  return (
    <tr
      data-slot='data-table-row'
      data-state={isSelected ? 'selected' : undefined}
      className={styles.root()}
      onClick={ui.onRowClick ? handleClick : undefined}
    >
      {!!selection.enabled && (
        <td
          className={`${styles.checkboxCell()} ${pinning.utility?.checkbox != null ? utilityPinClass : ''}`}
          style={pinning.utility?.checkbox != null ? { left: pinning.utility.checkbox } : undefined}
        >
          {isSelectable && (
            <button
              type='button'
              onClick={handleCheckbox}
              className={styles.checkboxButton()}
              aria-label='Selecionar linha'
            >
              <IconCheckbox
                checked={isSelected}
                size='sm'
                className={isSelected ? 'text-primary' : 'text-muted-foreground'}
              />
            </button>
          )}
        </td>
      )}

      {expansion.hasExpandable && (
        <td
          className={`${styles.expandCell()} ${pinning.utility?.expand != null ? utilityPinClass : ''}`}
          style={pinning.utility?.expand != null ? { left: pinning.utility.expand } : undefined}
        >
          {canExpand && (
            <button
              type='button'
              onClick={handleExpand}
              className={styles.expandButton()}
              aria-label={isExpanded ? 'Recolher' : 'Expandir'}
            >
              <IconChevronRight
                size='sm'
                className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              />
            </button>
          )}
        </td>
      )}

      {columns.visible.map((col) => (
        <DataTableCell key={col.id} row={row} column={col} />
      ))}
    </tr>
  );
}

export const DataTableRow = memo(DataTableRowInner, (prev, next) => {
  return prev.row.id === next.row.id && prev.row.original === next.row.original;
});
