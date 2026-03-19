import { Icon } from '../../_core/icon';
import type { IconArrowLeftProps } from './icon-arrow-left.types';

export function IconArrowLeft(props: IconArrowLeftProps) {
  return (
    <Icon {...props}>
      <path fill='currentColor' d='M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6l6 6z' />
    </Icon>
  );
}
