import { Icon } from '../../_core/icon';
import type { IconXCircleProps } from './icon-x-circle.types';

export function IconXCircle(props: IconXCircleProps) {
  return (
    <Icon {...props}>
      <circle fill='none' stroke='currentColor' strokeWidth='1.5' cx='12' cy='12' r='10' />
      <line
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        x1='15'
        y1='9'
        x2='9'
        y2='15'
      />
      <line
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        x1='9'
        y1='9'
        x2='15'
        y2='15'
      />
    </Icon>
  );
}
