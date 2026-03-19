import { Icon } from '../../_core/icon';
import type { IconGripVerticalProps } from './icon-grip-vertical.types';

export function IconGripVertical(props: IconGripVerticalProps) {
  return (
    <Icon {...props}>
      <circle fill='currentColor' cx='9' cy='4' r='1.5' />
      <circle fill='currentColor' cx='15' cy='4' r='1.5' />
      <circle fill='currentColor' cx='9' cy='10' r='1.5' />
      <circle fill='currentColor' cx='15' cy='10' r='1.5' />
      <circle fill='currentColor' cx='9' cy='16' r='1.5' />
      <circle fill='currentColor' cx='15' cy='16' r='1.5' />
      <circle fill='currentColor' cx='9' cy='22' r='1.5' />
      <circle fill='currentColor' cx='15' cy='22' r='1.5' />
    </Icon>
  );
}
