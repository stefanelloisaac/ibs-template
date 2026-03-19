import { Icon } from '../../_core/icon';
import type { IconArrowRightProps } from './icon-arrow-right.types';

export function IconArrowRight(props: IconArrowRightProps) {
  return (
    <Icon {...props}>
      <path fill='currentColor' d='M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6z' />
    </Icon>
  );
}
