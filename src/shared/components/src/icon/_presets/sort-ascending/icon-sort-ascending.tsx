import { Icon } from '../../_core/icon';
import type { IconSortAscendingProps } from './icon-sort-ascending.types';

export function IconSortAscending(props: IconSortAscendingProps) {
  return (
    <Icon {...props}>
      <path fill='currentColor' d='M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8z' />
    </Icon>
  );
}
