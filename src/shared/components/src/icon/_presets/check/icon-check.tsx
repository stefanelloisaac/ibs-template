import { Icon } from '../../_core/icon';
import type { IconCheckProps } from './icon-check.types';

export function IconCheck(props: IconCheckProps) {
  return (
    <Icon {...props}>
      <path
        d='m7 12 3.5 3.5 6.5-7'
        stroke='currentColor'
        strokeWidth='2.5'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Icon>
  );
}
