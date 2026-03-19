import { Activity, useCallback, useEffect, useRef, useState } from 'react';
import { useAnimationEnd } from '../../../../hooks/use-animation-end';
import { useArrowNavigation } from '../../../../hooks/use-arrow-navigation';
import { mergeRefs } from '../../../../lib/merge-refs';
import { SidebarPanelHeader } from '../panel-header/sidebar-panel-header';
import { SidebarPanelNavList } from '../panel-nav-list/sidebar-panel-nav-list';
import type { SidebarPanelProps } from './sidebar-panel.types';
import { sidebarPanelVariants } from './sidebar-panel.variants';

export function SidebarPanel(props: SidebarPanelProps) {
  const { modules, activeModuleId, brandLogo, open, onClose, onNavigate, ref } = props;

  const panelRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  const styles = sidebarPanelVariants();

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) setIsClosing(true);
    if (open) setIsClosing(false);
  }

  const handleClosingEnd = useCallback(() => setIsClosing(false), []);
  useAnimationEnd(panelRef, isClosing, handleClosingEnd);

  const { onKeyDown } = useArrowNavigation({
    containerRef: panelRef,
    selector: 'a, button[data-expandable]',
    onEscape: onClose,
  });

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const first = panelRef.current.querySelector<HTMLAnchorElement>('a');
    first?.focus();
  }, [open, activeModuleId]);

  const activeModule = modules.find((m) => m.id === activeModuleId) || modules[0];

  return (
    <div
      ref={mergeRefs(panelRef, ref)}
      data-slot='sidebar-panel'
      data-open={open ? '' : undefined}
      data-closing={isClosing ? '' : undefined}
      inert={!open && !isClosing ? true : undefined}
      className={styles.root()}
      role='tabpanel'
      aria-label={activeModule?.label}
      onKeyDown={onKeyDown}
    >
      {activeModule && <SidebarPanelHeader module={activeModule} brandLogo={brandLogo} onClose={onClose} />}

      <div className={styles.scrollArea()}>
        {modules.map((mod) => (
          <Activity key={mod.id} mode={mod.id === activeModuleId ? 'visible' : 'hidden'}>
            <SidebarPanelNavList module={mod} onNavigate={onNavigate} />
          </Activity>
        ))}
      </div>

      <div className={styles.footer()}>
        <span className={styles.footerHint()}>
          Navegar <kbd className={styles.footerKbd()}>↑</kbd> <kbd className={styles.footerKbd()}>↓</kbd>
        </span>
        <span className={styles.footerHint()}>
          Selecionar <kbd className={styles.footerKbd()}>↵</kbd>
        </span>
        <span className={styles.footerHint()}>
          Fechar <kbd className={styles.footerKbd()}>✕</kbd>
        </span>
      </div>
    </div>
  );
}
