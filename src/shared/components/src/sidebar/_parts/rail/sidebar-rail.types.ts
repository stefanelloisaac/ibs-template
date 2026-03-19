import type { SidebarModule } from '../../_core/sidebar.types';

export type SidebarRailProps = {
  modules: SidebarModule[];
  activeModule: string | null;
  onModuleClick: (moduleId: string) => void;
  logo?: React.ReactNode;
  settingsSlot?: React.ReactNode;
  avatarSlot?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
};
