/**
 * @hook useSidebar*
 * @description Hooks pre-construidos para consumir slices do store da sidebar.
 * Cada hook seleciona exatamente um slice para evitar re-renders desnecessarios.
 * `useSidebarModules` acessa a config diretamente (`s._config.modules`).
 *
 * @usage SidebarRail, SidebarPanel, SidebarSearch, sistema consumidor
 */

import { useSidebar } from '../../providers/sidebar.provider';

export const useSidebarActiveModule = () => useSidebar((s) => s.activeModule);
export const useSidebarPanelOpen = () => useSidebar((s) => s.panelOpen);
export const useSidebarSearchOpen = () => useSidebar((s) => s.searchOpen);
export const useSidebarSetActiveModule = () => useSidebar((s) => s.setActiveModule);
export const useSidebarSetPanelOpen = () => useSidebar((s) => s.setPanelOpen);
export const useSidebarSetSearchOpen = () => useSidebar((s) => s.setSearchOpen);
export const useSidebarTogglePanel = () => useSidebar((s) => s.togglePanel);
export const useSidebarModules = () => useSidebar((s) => s._config.modules);
