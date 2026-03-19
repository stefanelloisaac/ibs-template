import type { SidebarModule } from '../../_core/sidebar.types';

export type SidebarPanelHeaderProps = {
  module: SidebarModule;
  brandLogo?: string;
  onClose: () => void;
};
