import { IconDotsVertical } from '../../../icon/_presets/dots-vertical/icon-dots-vertical';
import { IconPin } from '../../../icon/_presets/pin/icon-pin';
import { IconSortAscending } from '../../../icon/_presets/sort-ascending/icon-sort-ascending';
import { IconSortDescending } from '../../../icon/_presets/sort-descending/icon-sort-descending';
import { PopoverMenu } from '../../../popover';
import type { PopoverMenuEntry } from '../../../popover/_presets/menu/popover-menu.types';
import type { DataTableHeaderMenuProps } from './data-table-header-menu.types';
import { dataTableHeaderMenuVariants } from './data-table-header-menu.variants';

export function DataTableHeaderMenu(props: DataTableHeaderMenuProps) {
  const { sortable, sortState, onSortAsc, onSortDesc, pinState, onPinLeft, onPinRight, onUnpin, onResetColumn } = props;

  const styles = dataTableHeaderMenuVariants();

  const items: PopoverMenuEntry[] = [];

  if (sortable) {
    items.push(
      {
        label: 'Ordenar Crescente',
        icon: <IconSortAscending size='xs' />,
        onClick: onSortAsc,
        active: sortState !== undefined && !sortState.desc,
      },
      {
        label: 'Ordenar Decrescente',
        icon: <IconSortDescending size='xs' />,
        onClick: onSortDesc,
        active: sortState?.desc === true,
      },
      'separator',
    );
  }

  items.push(
    {
      label: 'Fixar Coluna',
      icon: <IconPin size='xs' />,
      items: [
        { label: 'Esquerda', onClick: pinState === 'left' ? onUnpin : onPinLeft, active: pinState === 'left' },
        { label: 'Direita', onClick: pinState === 'right' ? onUnpin : onPinRight, active: pinState === 'right' },
      ],
    },
    {
      label: 'Resetar Coluna',
      icon: <IconSortAscending size='xs' className='rotate-180' />,
      onClick: onResetColumn,
    },
  );

  return (
    <PopoverMenu
      portal
      trigger={
        <button
          type='button'
          className={styles.trigger()}
          onClick={(e) => e.stopPropagation()}
          aria-label='Menu da coluna'
        >
          <IconDotsVertical size='xs' />
        </button>
      }
      items={items}
      contentClassName='min-w-44'
    />
  );
}
