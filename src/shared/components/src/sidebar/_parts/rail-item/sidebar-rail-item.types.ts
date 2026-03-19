import type { SidebarModule } from '../../_core/sidebar.types';

export type SidebarRailItemProps = {
  module: SidebarModule;
  isActive: boolean;
  onClick: () => void;
};
