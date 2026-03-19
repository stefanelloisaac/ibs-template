import { Icon } from '../../_core/icon';
import type { IconFilterProps } from './icon-filter.types';

export function IconFilter(props: IconFilterProps) {
  return (
    <Icon {...props}>
      <path fill='currentColor' d='M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z' />
    </Icon>
  );
}
