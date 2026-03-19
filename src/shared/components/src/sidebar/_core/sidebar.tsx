import { useCallback, useEffect, useId, useRef } from 'react';
import { useClickOutside } from '../../../hooks/use-click-outside';
import { ErrorBoundary } from '../../../lib/error-boundary';
import { useSidebar } from '../../../providers/sidebar.provider';
import { SidebarPanel } from '../_parts/panel/sidebar-panel';
import { SidebarRail } from '../_parts/rail/sidebar-rail';
import { SidebarSearch } from '../_parts/search/sidebar-search';
import type { SidebarBaseProps } from './sidebar.types';
import { sidebarVariants } from './sidebar.variants';

export function Sidebar(props: SidebarBaseProps) {
  const { className, id, ref, ...rest } = props;

  const generatedId = useId();
  const sidebarId = id || generatedId;
  const styles = sidebarVariants();

  const modules = useSidebar((s) => s._config.modules);
  const logo = useSidebar((s) => s._config.logo);
  const brandLogo = useSidebar((s) => s._config.brandLogo);
  const settingsSlot = useSidebar((s) => s._config.settingsSlot);
  const avatarSlot = useSidebar((s) => s._config.avatarSlot);
  const onNavigate = useSidebar((s) => s._config.onNavigate);
  const activeModule = useSidebar((s) => s.activeModule);
  const panelOpen = useSidebar((s) => s.panelOpen);
  const searchOpen = useSidebar((s) => s.searchOpen);
  const setPanelOpen = useSidebar((s) => s.setPanelOpen);
  const setSearchOpen = useSidebar((s) => s.setSearchOpen);
  const setActiveModule = useSidebar((s) => s.setActiveModule);
  const togglePanel = useSidebar((s) => s.togglePanel);

  const railRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === '/') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);

  const handlePanelClose = useCallback(() => {
    setPanelOpen(false);
  }, [setPanelOpen]);

  useClickOutside([railRef, panelRef], panelOpen, handlePanelClose);

  const activeModuleData = modules.find((m) => m.id === activeModule);

  const handleSearchSelect = useCallback(
    (moduleId: string, item: { label: string; href: string }) => {
      setActiveModule(moduleId);
      setSearchOpen(false);
      onNavigate?.(item.href);
    },
    [setActiveModule, setSearchOpen, onNavigate],
  );

  return (
    <ErrorBoundary>
      <div ref={ref} id={sidebarId} data-slot='sidebar' className={styles.root({ className })} {...rest}>
        <SidebarRail
          ref={railRef}
          modules={modules}
          activeModule={activeModule}
          onModuleClick={togglePanel}
          logo={logo}
          settingsSlot={settingsSlot}
          avatarSlot={avatarSlot}
        />

        <SidebarPanel
          ref={panelRef}
          modules={modules}
          activeModuleId={activeModule}
          brandLogo={brandLogo}
          open={panelOpen && !!activeModuleData}
          onClose={handlePanelClose}
          onNavigate={onNavigate}
        />

        <SidebarSearch
          modules={modules}
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelect={handleSearchSelect}
        />
      </div>
    </ErrorBoundary>
  );
}
