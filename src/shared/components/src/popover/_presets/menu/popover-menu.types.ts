import type { PopoverProps } from '../../_core/popover.types';

export interface PopoverMenuItem {
  label: string;
  icon?: React.ReactElement;
  onClick?: () => void;
  active?: boolean;
  items?: PopoverMenuItem[];
}

export type PopoverMenuEntry = PopoverMenuItem | 'separator';

export interface PopoverMenuProps extends Pick<PopoverProps, 'placement' | 'trigger' | 'portal' | 'portalContainer'> {
  items: PopoverMenuEntry[];
  className?: string;
  contentClassName?: string;
}
