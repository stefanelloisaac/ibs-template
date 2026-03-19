import { createStore } from 'zustand';
import type { SidebarStoreInit, SidebarStoreState } from './sidebar.types';

export type { SidebarStoreInit, SidebarStoreState } from './sidebar.types';

/**
 * @store createSidebarStore
 * @description Fabrica do store Zustand da sidebar. Gerencia qual modulo esta ativo,
 * se o painel esta aberto/fechado e se a busca esta aberta. `togglePanel` implementa
 * toggle inteligente: fecha se clicar no modulo ja ativo, senao abre e troca de modulo.
 *
 * @param init - { config: { modules, logo, brandLogo, settingsSlot, avatarSlot, onNavigate } }
 * @returns Store Zustand com estado da sidebar e actions de navegacao
 */

// MARK: StoreApi
export type SidebarStoreApi = ReturnType<typeof createSidebarStore>;

// MARK: Factory
export function createSidebarStore(init: SidebarStoreInit) {
  const store = createStore<SidebarStoreState>()((set, get) => ({
    _config: init.config,
    activeModule: null,
    panelOpen: false,
    searchOpen: false,

    setActiveModule: (id) => {
      set({ activeModule: id });
    },

    setPanelOpen: (open) => {
      set({ panelOpen: open });
    },

    setSearchOpen: (open) => {
      set({ searchOpen: open });
    },

    togglePanel: (moduleId) => {
      const s = get();
      if (s.activeModule === moduleId && s.panelOpen) {
        set({ panelOpen: false });
      } else {
        set({ activeModule: moduleId, panelOpen: true });
      }
    },

    _sync: (config) => {
      set({ _config: config });
    },
  }));

  return store;
}
