import { useCallback, useRef } from 'react';
import {
  useDataTableColumns,
  useDataTableExpansion,
  useDataTableFiltering,
  useDataTablePinning,
  useDataTableSelection,
  useDataTableSorting,
} from '../../../../store/data-table/use-data-table';
import { IconCheckbox } from '../../../icon/_presets/checkbox/icon-checkbox';
import { IconChevronDown } from '../../../icon/_presets/chevron-down/icon-chevron-down';
import { IconChevronUp } from '../../../icon/_presets/chevron-up/icon-chevron-up';
import { resolveColumnType } from '../../_core/data-table.registry';
import { getPinClassName, getUtilityPinClassName } from '../../_features/data-table-pinning';
import { DataTableHeaderFilter } from '../header-filter/data-table-header-filter';
import { DataTableHeaderMenu } from '../header-menu/data-table-header-menu';
import { dataTableHeaderVariants } from './data-table-header.variants';

export function DataTableHeader() {
  const columns = useDataTableColumns();
  const sorting = useDataTableSorting();
  const selection = useDataTableSelection();
  const expansion = useDataTableExpansion();
  const pinning = useDataTablePinning();
  const filtering = useDataTableFiltering();

  const resizingRef = useRef<{ columnId: string; startX: number; startWidth: number } | null>(null);

  const handleResizeStart = useCallback(
    (columnId: string, e: React.MouseEvent) => {
      e.preventDefault();
      const col = columns.visible.find((c) => c.id === columnId);
      const startWidth = columns.widths[columnId] ?? col?.size ?? 150;
      resizingRef.current = { columnId, startX: e.clientX, startWidth };

      const handleMouseMove = (ev: MouseEvent) => {
        if (!resizingRef.current) return;
        const diff = ev.clientX - resizingRef.current.startX;
        const col = columns.visible.find((c) => c.id === resizingRef.current!.columnId);
        const minSize = col?.minSize ?? 50;
        const maxSize = col?.maxSize ?? Infinity;
        const newWidth = Math.min(maxSize, Math.max(minSize, resizingRef.current.startWidth + diff));
        columns.setWidth(resizingRef.current.columnId, newWidth);
      };

      const handleMouseUp = () => {
        resizingRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [columns],
  );

  const styles = dataTableHeaderVariants();
  const utilityPinClass = getUtilityPinClassName(pinning.utility, 3, 'bg-table-header');

  return (
    <thead data-slot='data-table-header' className={styles.root()}>
      <tr className={styles.row()}>
        {!!selection.enabled && (
          <th
            scope='col'
            className={`${styles.cell()} ${styles.checkboxCell()} ${utilityPinClass}`}
            style={pinning.utility?.checkbox != null ? { left: pinning.utility.checkbox } : undefined}
          >
            <button
              type='button'
              onClick={selection.toggleAll}
              className={styles.checkboxButton()}
              aria-label='Selecionar todos'
            >
              <IconCheckbox
                checked={selection.isAllSelected || selection.isSomeSelected}
                size='sm'
                className={
                  selection.isAllSelected
                    ? 'text-primary'
                    : selection.isSomeSelected
                      ? 'text-primary/60'
                      : 'text-muted-foreground'
                }
              />
            </button>
          </th>
        )}

        {expansion.hasExpandable && (
          <th
            scope='col'
            className={`${styles.cell()} ${styles.checkboxCell()} ${utilityPinClass}`}
            style={pinning.utility?.expand != null ? { left: pinning.utility.expand } : undefined}
          />
        )}

        {columns.visible.map((col, colIndex) => {
          const sortState = sorting.state.find((s) => s.id === col.id);
          const typeConfig = col.type ? resolveColumnType(col.type) : null;
          const align = col.align ?? typeConfig?.align ?? 'left';
          const width = columns.widths[col.id] ?? col.size;
          const isLast = colIndex === columns.visible.length - 1;
          const canResize = col.enableResizing !== false && !isLast;
          const pin = pinning.offsets[col.id];
          const pinClass = getPinClassName(pin, 2, 'bg-table-header');
          const pinState = pinning.state[col.id];
          const hasFilter = filtering.enabled && col.enableFilter !== false;
          const filterValue = filtering.state[col.id] ?? {};
          const isColumnActive = !!sortState || Object.keys(filterValue).length > 0;

          return (
            <th
              scope='col'
              key={col.id}
              className={`${styles.cell({ active: isColumnActive })} ${pinClass}`}
              style={{
                width: width ? `${width}px` : undefined,
                textAlign: align,
                ...(pin ? { [pin.side]: pin.offset } : {}),
              }}
            >
              <div className={styles.cellWrapper()}>
                <div className={styles.cellContent({ alignRight: align === 'right' })}>
                  <span className={styles.cellLabel()}>
                    {col.sortable ? (
                      <button
                        type='button'
                        className={styles.sortButton()}
                        onClick={(e) => sorting.toggle(col.id, e.shiftKey)}
                      >
                        {col.header}
                        <span className={styles.sortIcon()}>
                          {sortState ? (
                            sortState.desc ? (
                              <IconChevronDown size='sm' color='muted' />
                            ) : (
                              <IconChevronUp size='sm' color='muted' />
                            )
                          ) : null}
                        </span>
                      </button>
                    ) : (
                      col.header
                    )}
                  </span>

                  <span className={styles.cellActions()}>
                    {hasFilter && (
                      <DataTableHeaderFilter
                        columnId={col.id}
                        columnType={col.type}
                        typeOptions={col.typeOptions}
                        filterValue={filterValue}
                        onFilterChange={(value) => filtering.setFilter(col.id, value)}
                      />
                    )}

                    <DataTableHeaderMenu
                      columnId={col.id}
                      sortable={col.sortable}
                      sortState={sortState}
                      onSortAsc={() => sorting.setSorting(col.id, false)}
                      onSortDesc={() => sorting.setSorting(col.id, true)}
                      pinState={pinState}
                      onPinLeft={() => pinning.pin(col.id, 'left')}
                      onPinRight={() => pinning.pin(col.id, 'right')}
                      onUnpin={() => pinning.unpin(col.id)}
                      onResetColumn={() => {
                        sorting.clearSort(col.id);
                        if (pinState) pinning.unpin(col.id);
                      }}
                    />
                  </span>
                </div>

                {canResize && (
                  <div
                    className={styles.resizeHandle()}
                    onMouseDown={(e) => handleResizeStart(col.id, e)}
                    role='separator'
                    aria-orientation='vertical'
                  />
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
