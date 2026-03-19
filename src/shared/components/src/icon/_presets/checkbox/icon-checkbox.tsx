import { Icon } from '../../_core/icon';
import type { IconCheckboxProps } from './icon-checkbox.types';

export function IconCheckbox({ checked, ...props }: IconCheckboxProps) {
  return (
    <Icon {...props}>
      <rect width='20' height='20' x='2' y='2' rx='5' stroke='currentColor' strokeWidth='2' fill='none' />
      {checked && (
        <path
          d='m7 12 3.5 3.5 6.5-7'
          stroke='currentColor'
          strokeWidth='2.5'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      )}
    </Icon>
  );
}
