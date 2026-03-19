import { Icon } from '../../_core/icon';
import type { IconEyeOffProps } from './icon-eye-off.types';

export function IconEyeOff(props: IconEyeOffProps) {
  return (
    <Icon {...props}>
      <path
        d='M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
      <path
        d='M14.084 14.158a3 3 0 0 1-4.242-4.242'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
      <path
        d='M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
      <path d='m2 2 20 20' stroke='currentColor' strokeWidth='2' strokeLinecap='round' fill='none' />
    </Icon>
  );
}
