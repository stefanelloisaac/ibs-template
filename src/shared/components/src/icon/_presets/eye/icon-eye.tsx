import { Icon } from '../../_core/icon';
import type { IconEyeProps } from './icon-eye.types';

export function IconEye(props: IconEyeProps) {
  return (
    <Icon {...props}>
      <path
        d='M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
      <circle cx='12' cy='12' r='3' stroke='currentColor' strokeWidth='2' fill='none' />
    </Icon>
  );
}
