import { useRef } from 'react';
import { mergeRefs } from '../../../../lib/merge-refs';
import { SidebarRailItem } from '../rail-item/sidebar-rail-item';
import type { SidebarRailProps } from './sidebar-rail.types';
import { sidebarRailVariants } from './sidebar-rail.variants';

export function SidebarRail(props: SidebarRailProps) {
  const { modules, activeModule, onModuleClick, logo, settingsSlot, avatarSlot, ref } = props;

  const internalRef = useRef<HTMLElement>(null);
  const styles = sidebarRailVariants();

  return (
    <nav
      ref={mergeRefs(internalRef, ref)}
      data-slot='sidebar-rail'
      className={styles.root()}
      aria-label='Module navigation'
    >
      {logo && <div className={styles.logo()}>{logo}</div>}

      <div className={styles.moduleList()} role='tablist' aria-orientation='vertical'>
        {modules.map((mod) => (
          <SidebarRailItem
            key={mod.id}
            module={mod}
            isActive={activeModule === mod.id}
            onClick={() => onModuleClick(mod.id)}
          />
        ))}
      </div>

      <div className={styles.footer()}>
        {settingsSlot}
        {avatarSlot}
      </div>
    </nav>
  );
}
