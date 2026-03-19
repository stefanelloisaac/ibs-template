import { createContext, useContext, useLayoutEffect, useState } from 'react';
import { useStore } from 'zustand';
import { Sidebar } from '../src/sidebar';
import { createSidebarStore, type SidebarStoreApi, type SidebarStoreState } from '../store/sidebar/sidebar.store';
import type { SidebarStoreConfig } from '../store/sidebar/sidebar.types';

/**
 * @provider SidebarProvider
 * @description Cria o store Zustand da sidebar e renderiza o componente `<Sidebar />` automaticamente.
 * O sistema consumidor so precisa envolver a aplicacao com este provider — a sidebar
 * se monta sozinha. A configuracao (modulos, logo, navegacao) e passada via props
 * e sincronizada com o store via `useLayoutEffect`.
 *
 * @param modules - Lista de modulos exibidos no rail da sidebar
 * @param logo - Logo compacto exibido no topo do rail
 * @param brandLogo - Logo completo exibido no topo do painel expandido
 * @param settingsSlot - Slot para icone/botao de configuracoes no rail
 * @param avatarSlot - Slot para avatar do usuario no rail
 * @param onNavigate - Callback chamado ao clicar em um item de navegacao
 */

interface SidebarProviderProps extends SidebarStoreConfig {
  children: React.ReactNode;
}

const SidebarContext = createContext<SidebarStoreApi | null>(null);

export function SidebarProvider({
  children,
  modules,
  logo,
  brandLogo,
  settingsSlot,
  avatarSlot,
  onNavigate,
}: SidebarProviderProps) {
  const [store] = useState(() =>
    createSidebarStore({ config: { modules, logo, brandLogo, settingsSlot, avatarSlot, onNavigate } }),
  );

  useLayoutEffect(() => {
    store.getState()._sync({ modules, logo, brandLogo, settingsSlot, avatarSlot, onNavigate });
  });

  return (
    <SidebarContext.Provider value={store}>
      <Sidebar />
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarStoreApi(): SidebarStoreApi {
  const store = useContext(SidebarContext);
  if (!store) throw new Error('Sidebar: must be used within <SidebarProvider>');
  return store;
}

export function useSidebar<T>(selector: (state: SidebarStoreState) => T): T {
  const store = useSidebarStoreApi();
  return useStore(store, selector);
}
