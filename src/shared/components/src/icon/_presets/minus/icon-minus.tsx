import { Icon } from '../../_core/icon';
import type { IconMinusProps } from './icon-minus.types';

export function IconMinus(props: IconMinusProps) {
  return (
    <Icon {...props}>
      <path fill='currentColor' d='M19 13H5v-2h14v2z' />
    </Icon>
  );
}
