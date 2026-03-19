import type { SidebarPanelHeaderProps } from './sidebar-panel-header.types';
import { sidebarPanelHeaderVariants } from './sidebar-panel-header.variants';

export function SidebarPanelHeader(props: SidebarPanelHeaderProps) {
  const { module, brandLogo, onClose } = props;

  const styles = sidebarPanelHeaderVariants();

  return (
    <>
      {brandLogo && (
        <div className={styles.brand()}>
          <img src={brandLogo} alt='Brand' className={styles.brandLogo()} />
        </div>
      )}

      <div className={styles.header()}>
        <div className={styles.headerIcon()}>{module.icon}</div>
        <div className={styles.headerInfo()}>
          <span className={styles.headerLabel()}>{module.label}</span>
          <span className={styles.headerCount()}>{module.subItems.length} sections</span>
        </div>
        <button type='button' className={styles.headerClose()} onClick={onClose} aria-label='Close panel'>
          <svg
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M18 6 6 18' />
            <path d='m6 6 12 12' />
          </svg>
        </button>
      </div>
    </>
  );
}
