import { Icon } from '../../_core/icon';
import type { IconDotsVerticalProps } from './icon-dots-vertical.types';

export function IconDotsVertical(props: IconDotsVerticalProps) {
  return (
    <Icon {...props}>
      <circle fill='currentColor' cx='12' cy='5' r='2' />
      <circle fill='currentColor' cx='12' cy='12' r='2' />
      <circle fill='currentColor' cx='12' cy='19' r='2' />
    </Icon>
  );
}
