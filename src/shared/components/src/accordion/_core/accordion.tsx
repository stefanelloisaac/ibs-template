import { useCallback, useId, useMemo } from 'react';
import { useControllable } from '../../../hooks/use-controllable';
import { ErrorBoundary } from '../../../lib/error-boundary';
import { IconChevronDown } from '../../icon';
import type { AccordionBaseProps } from './accordion.types';
import { accordionVariants } from './accordion.variants';

export function Accordion(props: AccordionBaseProps) {
  const { className, type = 'single', items, value, defaultValue, onValueChange, disabled, id, ref, ...rest } = props;

  const generatedId = useId();
  const baseId = id || generatedId;
  const styles = accordionVariants();

  const normalizedValue = useMemo(
    () => (value !== undefined ? (Array.isArray(value) ? value : [value]) : undefined),
    [value],
  );

  const normalizedDefault = useMemo(
    () => (defaultValue !== undefined ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : []),
    [defaultValue],
  );

  const [expandedValues, setExpandedValues] = useControllable<string[]>(normalizedValue, normalizedDefault, (next) => {
    if (type === 'single') {
      (onValueChange as ((v: string) => void) | undefined)?.(next[0] ?? '');
    } else {
      (onValueChange as ((v: string[]) => void) | undefined)?.(next);
    }
  });

  const toggle = useCallback(
    (itemValue: string) => {
      setExpandedValues((prev) => {
        if (type === 'single') {
          return prev.includes(itemValue) ? [] : [itemValue];
        }
        return prev.includes(itemValue) ? prev.filter((v) => v !== itemValue) : [...prev, itemValue];
      });
    },
    [type, setExpandedValues],
  );

  const handleTriggerClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const val = e.currentTarget.dataset.value;
      if (val) toggle(val);
    },
    [toggle],
  );

  return (
    <ErrorBoundary>
      <div ref={ref} id={baseId} data-slot='accordion' className={styles.root({ className })} {...rest}>
        {items.map((item) => {
          const isExpanded = expandedValues.includes(item.value);
          const triggerId = `${baseId}-trigger-${item.value}`;
          const contentId = `${baseId}-content-${item.value}`;

          return (
            <div
              key={item.value}
              data-slot='accordion-item'
              data-state={isExpanded ? 'open' : 'closed'}
              className={styles.item()}
            >
              <button
                type='button'
                id={triggerId}
                data-slot='accordion-trigger'
                className={styles.trigger()}
                aria-expanded={isExpanded}
                aria-controls={contentId}
                data-value={item.value}
                onClick={handleTriggerClick}
                disabled={disabled}
              >
                {item.trigger}
                <IconChevronDown size='sm' color='muted' />
              </button>
              <div
                id={contentId}
                role='region'
                data-slot='accordion-content'
                aria-labelledby={triggerId}
                className={styles.content()}
                style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
              >
                <div className={styles.contentInner()}>
                  <div className='pb-4 text-sm'>{item.content}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ErrorBoundary>
  );
}
