import type { SidebarPanelNavItemProps } from './sidebar-panel-nav-item.types';
import { sidebarPanelNavItemVariants } from './sidebar-panel-nav-item.variants';

function ChevronIcon({ className, expanded }: { className: string; expanded: boolean }) {
  return (
    <svg
      className={className}
      style={{ transform: expanded ? 'rotate(90deg)' : undefined }}
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m9 18 6-6-6-6' />
    </svg>
  );
}

export function SidebarPanelNavItem(props: SidebarPanelNavItemProps) {
  const { item, index, isExpanded, onToggle, onNavigate } = props;

  const styles = sidebarPanelNavItemVariants();
  const hasChildren = item.children && item.children.length > 0;

  const content = (
    <>
      <span className={styles.navNumber()}>{String(index + 1).padStart(2, '0')}</span>
      <div className='flex-1'>
        <div className={styles.navLabel()}>{item.label}</div>
        {item.description && <div className={styles.navDescription()}>{item.description}</div>}
      </div>
      {hasChildren && <ChevronIcon className={styles.navChevron()} expanded={isExpanded} />}
    </>
  );

  return (
    <li>
      {hasChildren && !item.href ? (
        <button
          type='button'
          data-expandable
          className={styles.navItem()}
          onClick={onToggle}
          aria-expanded={isExpanded}
        >
          {content}
        </button>
      ) : (
        <a
          href={item.href}
          className={styles.navItem()}
          onClick={(e) => {
            e.preventDefault();
            if (hasChildren) onToggle();
            if (item.href) onNavigate(item.href);
          }}
        >
          {content}
        </a>
      )}

      {hasChildren && isExpanded && (
        <div className={styles.navChildren()}>
          {item.children!.map((child) => (
            <a
              key={child.href}
              href={child.href}
              className={styles.navChildItem()}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(child.href);
              }}
            >
              {child.label}
            </a>
          ))}
        </div>
      )}
    </li>
  );
}
