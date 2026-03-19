import { useCallback, useEffect, useRef, useState } from 'react';
import { useArrowNavigation } from '../../../../hooks/use-arrow-navigation';
import { IconChevronRight } from '../../../icon';
import { Popover } from '../../_core/popover';
import type { PopoverMenuEntry, PopoverMenuItem, PopoverMenuProps } from './popover-menu.types';
import { popoverMenuVariants } from './popover-menu.variants';

export function PopoverMenu(props: PopoverMenuProps) {
  const { trigger, items, placement = 'bottom-start', portal, portalContainer, className, contentClassName } = props;

  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const styles = popoverMenuVariants();

  const { onKeyDown: handleNav } = useArrowNavigation({
    containerRef: menuRef,
    selector: '[role="menuitem"]:not([disabled])',
    homeEnd: true,
  });

  const handleAction = useCallback((action?: () => void) => {
    action?.();
    setOpen(false);
    setSubmenuOpen(null);
  }, []);

  const findItemByLabel = useCallback(
    (label: string | undefined): PopoverMenuItem | undefined => {
      if (!label) return undefined;
      for (const entry of items) {
        if (entry === 'separator') continue;
        if (entry.items) {
          const found = entry.items.find((sub) => sub.label === label);
          if (found) return found;
        } else if (entry.label === label) return entry;
      }
    },
    [items],
  );

  const handleMenuItemClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      handleAction(findItemByLabel(e.currentTarget.dataset.label)?.onClick);
    },
    [findItemByLabel, handleAction],
  );

  const handleSubmenuTriggerClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const label = e.currentTarget.dataset.submenuLabel!;
    setSubmenuOpen((prev) => (prev === label ? null : label));
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setSubmenuOpen(null);
  };

  useEffect(() => {
    if (open && menuRef.current) {
      const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'));
      items[0]?.focus();
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowRight': {
        const focused = document.activeElement as HTMLElement;
        if (focused?.dataset.hasSubmenu) {
          e.preventDefault();
          setSubmenuOpen(focused.dataset.submenuLabel ?? null);
        }
        return;
      }
      case 'ArrowLeft': {
        if (submenuOpen) {
          e.preventDefault();
          setSubmenuOpen(null);
        }
        return;
      }
      case 'Escape': {
        e.preventDefault();
        if (submenuOpen) setSubmenuOpen(null);
        else setOpen(false);
        return;
      }
    }
    handleNav(e);
  };

  const renderMenuItem = (item: PopoverMenuItem) => (
    <button
      key={item.label}
      type='button'
      role='menuitem'
      tabIndex={-1}
      className={styles.menuItem({ active: item.active })}
      data-label={item.label}
      onClick={handleMenuItemClick}
    >
      {item.icon}
      <span>{item.label}</span>
    </button>
  );

  const renderEntry = (entry: PopoverMenuEntry, index: number) => {
    if (entry === 'separator') {
      return <div key={`sep-${index}`} role='separator' className={styles.separator()} />;
    }

    if (entry.items) {
      const isSubOpen = submenuOpen === entry.label;

      return (
        <div key={entry.label} className='relative'>
          <button
            type='button'
            role='menuitem'
            tabIndex={-1}
            aria-haspopup='menu'
            aria-expanded={isSubOpen}
            data-has-submenu='true'
            data-submenu-label={entry.label}
            className={styles.submenuTrigger()}
            onClick={handleSubmenuTriggerClick}
          >
            <span className='flex items-center gap-2'>
              {entry.icon}
              <span>{entry.label}</span>
            </span>
            <IconChevronRight size='xs' />
          </button>
          {isSubOpen && (
            <div role='menu' className={styles.submenu()}>
              {entry.items.map((sub) => renderMenuItem(sub))}
            </div>
          )}
        </div>
      );
    }

    return renderMenuItem(entry);
  };

  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}
      placement={placement}
      portal={portal}
      portalContainer={portalContainer}
      className={styles.root({ className })}
      trigger={trigger}
      contentClassName={styles.content({ className: contentClassName })}
    >
      <div ref={menuRef} role='menu' onKeyDown={handleKeyDown}>
        {items.map((entry, i) => renderEntry(entry, i))}
      </div>
    </Popover>
  );
}
