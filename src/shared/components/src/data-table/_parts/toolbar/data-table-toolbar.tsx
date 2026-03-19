import { useState } from 'react';
import {
  useDataTableColumns,
  useDataTableExpansion,
  useDataTableFiltering,
  useDataTableSelection,
} from '../../../../store/data-table/use-data-table';
import { IconChevronDown } from '../../../icon/_presets/chevron-down/icon-chevron-down';
import { IconChevronUp } from '../../../icon/_presets/chevron-up/icon-chevron-up';
import { IconClose } from '../../../icon/_presets/close/icon-close';
import { IconEye } from '../../../icon/_presets/eye/icon-eye';
import { Popover } from '../../../popover';
import type { DataTableToolbarProps } from './data-table-toolbar.types';
import { dataTableToolbarVariants } from './data-table-toolbar.variants';

export function DataTableToolbar(props: DataTableToolbarProps) {
  const { className, ...rest } = props;

  const columns = useDataTableColumns();
  const expansion = useDataTableExpansion();
  const filtering = useDataTableFiltering();
  const selection = useDataTableSelection();

  const [visibilityOpen, setVisibilityOpen] = useState(false);

  const hasActiveFilters = Object.keys(filtering.state).length > 0;
  const selectedCount = Object.keys(selection.state).length;

  const styles = dataTableToolbarVariants();

  return (
    <div data-slot='data-table-toolbar' className={styles.root({ className })} {...rest}>
      <div className={styles.left()}>
        {expansion.hasExpandable && (
          <>
            <button type='button' onClick={expansion.expandAll} className={styles.toolbarButton()}>
              <IconChevronDown size='xs' />
              <span>Expandir</span>
            </button>
            <button type='button' onClick={expansion.collapseAll} className={styles.toolbarButton()}>
              <IconChevronUp size='xs' />
              <span>Recolher</span>
            </button>
          </>
        )}
        {selectedCount > 0 && (
          <span className={styles.selectedCount()}>
            {selectedCount} selecionado{selectedCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className={styles.right()}>
        {hasActiveFilters && (
          <button type='button' onClick={filtering.clearAll} className={styles.toolbarButton()}>
            <IconClose size='xs' />
            <span>Limpar filtros</span>
          </button>
        )}

        {columns.enableVisibility && (
          <Popover
            open={visibilityOpen}
            onOpenChange={setVisibilityOpen}
            trigger={
              <button type='button' className={styles.toolbarButton({ active: visibilityOpen })}>
                <IconEye size='xs' />
                <span>Colunas</span>
              </button>
            }
            contentClassName='min-w-45 p-1'
          >
            {columns.all.map((col) => (
              <label key={col.id} className={styles.dropdownItem()}>
                <input
                  type='checkbox'
                  checked={columns.visibility[col.id] !== false}
                  onChange={() => columns.toggleVisibility(col.id)}
                  className='accent-primary'
                />
                <span>{typeof col.header === 'string' ? col.header : col.id}</span>
              </label>
            ))}
          </Popover>
        )}
      </div>
    </div>
  );
}
