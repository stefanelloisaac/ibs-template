import { Icon } from '../../_core/icon';
import type { IconFilterLinesProps } from './icon-filter-lines.types';

export function IconFilterLines(props: IconFilterLinesProps) {
  return (
    <Icon {...props}>
      <path
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M20 7h-9'
      />
      <path
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M14 17H5'
      />
      <circle fill='none' stroke='currentColor' strokeWidth='1.5' cx='17' cy='17' r='3' />
      <circle fill='none' stroke='currentColor' strokeWidth='1.5' cx='7' cy='7' r='3' />
    </Icon>
  );
}
