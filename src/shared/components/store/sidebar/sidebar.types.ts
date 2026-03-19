/**
 * @store SidebarStoreState
 * @description Tipos do store da sidebar. Config contem modulos, logos e slots.
 * Estado contem modulo ativo, painel aberto/fechado, busca aberta/fechada,
 * e actions para controlar navegacao.
 */

import type { SidebarModule } from '../../src/sidebar/_core/sidebar.types';

// MARK: Config
export type SidebarStoreConfig = {
  modules: SidebarModule[];
  logo?: React.ReactNode;
  brandLogo?: string;
  settingsSlot?: React.ReactNode;
  avatarSlot?: React.ReactNode;
  onNavigate?: (href: string) => void;
};

// MARK: Init
export type SidebarStoreInit = {
  config: SidebarStoreConfig;
};

// MARK: Store State
export type SidebarStoreState = {
  _config: SidebarStoreConfig;
  activeModule: string | null;
  panelOpen: boolean;
  searchOpen: boolean;
  setActiveModule: (id: string | null) => void;
  setPanelOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  togglePanel: (moduleId: string) => void;
  _sync: (config: SidebarStoreConfig) => void;
};
