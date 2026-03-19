import { useSidebar } from '../../../../providers/sidebar.provider';
import { Tooltip } from '../../../tooltip';
import type { SidebarRailItemProps } from './sidebar-rail-item.types';
import { sidebarRailItemVariants } from './sidebar-rail-item.variants';

export function SidebarRailItem(props: SidebarRailItemProps) {
  const { module, isActive, onClick } = props;
  const panelOpen = useSidebar((s) => s.panelOpen);

  const styles = sidebarRailItemVariants({ active: isActive });

  const button = (
    <button
      type='button'
      role='tab'
      aria-selected={isActive}
      aria-label={module.label}
      className={styles.root()}
      onClick={onClick}
    >
      {module.icon}
    </button>
  );

  if (panelOpen) return button;

  return (
    <Tooltip content={module.label} placement='right' delay={200}>
      {button}
    </Tooltip>
  );
}
