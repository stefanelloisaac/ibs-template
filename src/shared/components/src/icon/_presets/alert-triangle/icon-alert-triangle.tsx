import { Icon } from '../../_core/icon';
import type { IconAlertTriangleProps } from './icon-alert-triangle.types';

export function IconAlertTriangle(props: IconAlertTriangleProps) {
  return (
    <Icon {...props}>
      <path fill='currentColor' d='M12 5.99L19.53 19H4.47zM12 2L1 21h22z' />
      <path fill='currentColor' d='M13 16h-2v2h2zm0-6h-2v5h2z' />
    </Icon>
  );
}
