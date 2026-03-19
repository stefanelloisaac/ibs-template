import type { DataTablePinnedOffset } from '../_core/data-table.types';

function getZIndexClass(zIndex: 1 | 2 | 3): string {
  switch (zIndex) {
    case 1:
      return 'z-[1]';
    case 2:
      return 'z-[2]';
    case 3:
      return 'z-[3]';
  }
}

export function getPinClassName(pin: DataTablePinnedOffset | undefined, zIndex: 1 | 2 | 3, extra?: string): string {
  if (!pin) return '';
  const shadow = pin.isEdge
    ? pin.side === 'left'
      ? 'shadow-[1px_0_0_0_var(--table-border)]'
      : 'shadow-[-1px_0_0_0_var(--table-border)]'
    : '';
  return `sticky ${getZIndexClass(zIndex)} ${shadow} ${extra ?? ''}`.trim();
}

export function getUtilityPinClassName(
  utilityPinning: { checkbox: number | null; expand: number | null } | null,
  zIndex: 1 | 2 | 3,
  extra?: string,
): string {
  if (!utilityPinning) return '';
  return `sticky ${getZIndexClass(zIndex)} ${extra ?? ''}`.trim();
}
