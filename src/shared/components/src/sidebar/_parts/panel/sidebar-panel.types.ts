import type { SidebarModule } from '../../_core/sidebar.types';

export type SidebarPanelProps = {
  modules: SidebarModule[];
  activeModuleId: string | null;
  brandLogo?: string;
  open: boolean;
  onClose: () => void;
  onNavigate?: (href: string) => void;
  ref?: React.Ref<HTMLDivElement>;
};
