import { useMemo, useState, useRef } from 'react';
import { useArrowNavigation } from '../../../../hooks/use-arrow-navigation';
import { useDialogElement } from '../../../../hooks/use-dialog-element';
import type { SidebarSearchProps, SidebarSearchResult } from './sidebar-search.types';
import { sidebarSearchVariants } from './sidebar-search.variants';

export function SidebarSearch(props: SidebarSearchProps) {
  const { modules, open, onClose, onSelect } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');

  const { dialogRef, isClosing } = useDialogElement({
    open,
    onClose,
    onOpen: () => inputRef.current?.focus(),
  });

  const [prevOpen, setPrevOpen] = useState(open);
  if (open && !prevOpen) {
    setPrevOpen(true);
    setQuery('');
  }
  if (!open && prevOpen) {
    setPrevOpen(false);
  }

  const styles = sidebarSearchVariants();

  const results = useMemo<SidebarSearchResult[]>(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();

    return modules.flatMap((mod) => {
      const modMatches = mod.label.toLowerCase().includes(lowerQuery);
      const matched: SidebarSearchResult[] = [];

      for (const item of mod.subItems) {
        const itemMatches =
          modMatches ||
          item.label.toLowerCase().includes(lowerQuery) ||
          item.description?.toLowerCase().includes(lowerQuery);

        if (itemMatches && item.href) {
          matched.push({ module: mod, item: { label: item.label, href: item.href } });
        }

        if (item.children) {
          for (const child of item.children) {
            if (modMatches || itemMatches || child.label.toLowerCase().includes(lowerQuery)) {
              matched.push({ module: mod, item: { label: child.label, href: child.href } });
            }
          }
        }
      }

      return matched;
    });
  }, [query, modules]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  const { onKeyDown: handleNavigation } = useArrowNavigation({
    containerRef: dialogRef,
    selector: '[role="option"]',
    inputRef,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'Enter') {
      const active = document.activeElement as HTMLElement;
      if (active?.getAttribute('role') === 'option') {
        e.preventDefault();
        active.click();
        return;
      }
    }
    handleNavigation(e);
  };

  return (
    <dialog
      ref={dialogRef}
      data-slot='sidebar-search'
      data-closing={isClosing ? '' : undefined}
      className={styles.root()}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.inputWrapper()}>
        <svg
          className={styles.searchIcon()}
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <circle cx='11' cy='11' r='8' />
          <path d='m21 21-4.3-4.3' />
        </svg>
        <input
          ref={inputRef}
          type='text'
          className={styles.input()}
          placeholder='Search modules and items...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          role='combobox'
          aria-expanded={results.length > 0}
          aria-controls='sidebar-search-results'
          aria-autocomplete='list'
        />
      </div>

      <div ref={resultsRef} id='sidebar-search-results' className={styles.resultsList()} role='listbox'>
        {query.trim() && results.length === 0 && <div className={styles.emptyState()}>No results found</div>}
        {results.map((result) => (
          <div
            key={`${result.module.id}-${result.item.href}`}
            role='option'
            tabIndex={-1}
            className={styles.resultItem()}
            onClick={() => onSelect(result.module.id, result.item)}
          >
            <div className={styles.resultIcon()}>{result.module.icon}</div>
            <div className={styles.resultInfo()}>
              <span className={styles.resultLabel()}>{result.item.label}</span>
              <span className={styles.resultModule()}>{result.module.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer()}>
        <span className={styles.footerHint()}>
          Navigate <kbd className={styles.footerKbd()}>↑</kbd> <kbd className={styles.footerKbd()}>↓</kbd>
        </span>
        <span className={styles.footerHint()}>
          select <kbd className={styles.footerKbd()}>↵</kbd>
        </span>
        <span className={styles.footerHint()}>
          close <kbd className={styles.footerKbd()}>esc</kbd>
        </span>
      </div>
    </dialog>
  );
}
