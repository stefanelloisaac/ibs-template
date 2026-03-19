import { Activity, useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import { useArrowNavigation } from '../../../hooks/use-arrow-navigation';
import { useControllable } from '../../../hooks/use-controllable';
import { ErrorBoundary } from '../../../lib/error-boundary';
import type { TabsBaseProps } from './tabs.types';
import { tabsVariants } from './tabs.variants';

export function Tabs(props: TabsBaseProps) {
  const {
    className,
    variant = 'enclosed',
    fullWidth,
    tabs,
    value,
    defaultValue,
    onValueChange,
    id,
    ref,
    ...rest
  } = props;

  const generatedId = useId();
  const baseId = id || generatedId;
  const listRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useControllable(value, defaultValue ?? tabs[0]?.value ?? '', onValueChange);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const activeEl = list.querySelector<HTMLElement>('[data-state="active"]');
    if (!activeEl) return;

    setIndicatorStyle({
      width: activeEl.offsetWidth,
      transform: `translateX(${activeEl.offsetLeft}px)`,
    });
  }, [activeTab]);

  const { onKeyDown: handleKeyDown } = useArrowNavigation({
    containerRef: listRef,
    selector: '[role="tab"]:not([disabled])',
    orientation: 'horizontal',
    homeEnd: true,
  });

  const handleTabClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const val = e.currentTarget.dataset.value;
      if (val) setActiveTab(val);
    },
    [setActiveTab],
  );

  const styles = tabsVariants({ variant, fullWidth });

  return (
    <ErrorBoundary>
      <div ref={ref} id={baseId} data-slot='tabs' className={styles.root({ className })} {...rest}>
        <div
          ref={listRef}
          role='tablist'
          aria-orientation='horizontal'
          data-slot='tabs-list'
          className={styles.list()}
          onKeyDown={handleKeyDown}
        >
          <span data-slot='tabs-indicator' className={styles.indicator()} style={indicatorStyle} />
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                role='tab'
                type='button'
                id={`${baseId}-tab-${tab.value}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel-${tab.value}`}
                tabIndex={isActive ? 0 : -1}
                data-state={isActive ? 'active' : 'inactive'}
                data-slot='tabs-trigger'
                disabled={tab.disabled}
                className={styles.trigger()}
                data-value={tab.value}
                onClick={handleTabClick}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {tabs.map((tab) => (
          <Activity key={tab.value} mode={activeTab === tab.value ? 'visible' : 'hidden'}>
            <div
              role='tabpanel'
              id={`${baseId}-panel-${tab.value}`}
              aria-labelledby={`${baseId}-tab-${tab.value}`}
              tabIndex={0}
              data-slot='tabs-content'
              className={styles.content()}
            >
              {tab.content}
            </div>
          </Activity>
        ))}
      </div>
    </ErrorBoundary>
  );
}
