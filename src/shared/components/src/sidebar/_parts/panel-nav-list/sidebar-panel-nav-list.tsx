import { useState } from 'react';
import type { SidebarModule } from '../../_core/sidebar.types';
import { SidebarPanelNavItem } from '../panel-nav-item/sidebar-panel-nav-item';
import { sidebarPanelNavListVariants } from './sidebar-panel-nav-list.variants';

type SidebarPanelNavListProps = {
  module: SidebarModule;
  onNavigate?: (href: string) => void;
};

export function SidebarPanelNavList(props: SidebarPanelNavListProps) {
  const { module, onNavigate } = props;

  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const styles = sidebarPanelNavListVariants();

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleItemClick = (href: string) => {
    onNavigate?.(href);
  };

  return (
    <div className={styles.root()}>
      <ol className={styles.navList()}>
        {module.subItems.map((item, index) => (
          <SidebarPanelNavItem
            key={item.href ?? `group-${index}`}
            item={item}
            index={index}
            isExpanded={expandedItems.has(index)}
            onToggle={() => toggleExpanded(index)}
            onNavigate={handleItemClick}
          />
        ))}
      </ol>
    </div>
  );
}
