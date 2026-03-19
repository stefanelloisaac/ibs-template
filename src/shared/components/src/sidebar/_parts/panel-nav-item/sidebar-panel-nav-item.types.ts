import type { SidebarSubItem } from '../../_core/sidebar.types';

export type SidebarPanelNavItemProps = {
  item: SidebarSubItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (href: string) => void;
};
