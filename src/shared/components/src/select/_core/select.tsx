import { useCallback, useId, useRef, useState } from 'react';
import { useArrowNavigation } from '../../../hooks/use-arrow-navigation';
import { useControllable } from '../../../hooks/use-controllable';
import { ErrorBoundary } from '../../../lib/error-boundary';
import { FormError } from '../../form';
import { IconChevronDown } from '../../icon';
import { Label } from '../../label';
import { Popover } from '../../popover/_core/popover';
import type { SelectProps } from './select.types';
import { selectVariants } from './select.variants';

export function Select(props: SelectProps) {
  const {
    className,
    intent,
    fullWidth,
    placement = 'bottom-start',
    label,
    placeholder = 'Selecione',
    options,
    value,
    defaultValue,
    onValueChange,
    name,
    required,
    disabled,
    errorMessage,
    onBlur,
    id,
    ref,
  } = props;

  const hiddenRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;

  const [currentValue, setCurrentValue] = useControllable<string>(value, defaultValue ?? '', onValueChange);
  const [open, setOpen] = useState(false);

  const resolvedIntent = errorMessage ? 'error' : intent;
  const selectedOption = options.find((o) => o.value === currentValue);

  const styles = selectVariants({ intent: resolvedIntent, fullWidth });

  const {
    highlightedIndex,
    setHighlightedIndex,
    onKeyDown: handleArrowNav,
  } = useArrowNavigation({
    count: options.length,
    loop: false,
    onEscape: () => setOpen(false),
  });

  const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (hiddenRef.current && onBlur) {
      const event = { ...e, target: hiddenRef.current, currentTarget: hiddenRef.current };
      onBlur(event as unknown as React.FocusEvent<HTMLInputElement>);
    }
  };

  const handleSelect = useCallback(
    (optionValue: string) => {
      setCurrentValue(optionValue);
      setOpen(false);
      setHighlightedIndex(-1);
    },
    [setCurrentValue, setHighlightedIndex],
  );

  const handleOptionClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const val = e.currentTarget.dataset.value;
      if (val) handleSelect(val);
    },
    [handleSelect],
  );

  const handleOptionMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setHighlightedIndex(Number(e.currentTarget.dataset.index));
    },
    [setHighlightedIndex],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
        setHighlightedIndex(
          currentValue
            ? Math.max(
                options.findIndex((o) => o.value === currentValue),
                0,
              )
            : 0,
        );
      }
      return;
    }
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0 && options[highlightedIndex]) {
          handleSelect(options[highlightedIndex].value);
        }
        return;
      case 'Tab':
        setOpen(false);
        setHighlightedIndex(-1);
        return;
    }
    handleArrowNav(e);
  };

  return (
    <ErrorBoundary>
      <div className={styles.root({ className })} onBlur={handleContainerBlur}>
        {label && (
          <Label htmlFor={selectId} required={required} intent={resolvedIntent}>
            {label}
          </Label>
        )}

        {name && (
          <input
            ref={hiddenRef}
            className='sr-only'
            tabIndex={-1}
            name={name}
            value={currentValue}
            required={required}
            onChange={() => {}}
          />
        )}

        <Popover
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) setHighlightedIndex(-1);
          }}
          placement={placement}
          trigger={
            <button
              ref={ref}
              id={selectId}
              type='button'
              data-slot='select'
              className={styles.trigger()}
              disabled={disabled}
              onKeyDown={handleKeyDown}
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? errorId : undefined}
              aria-required={required}
              aria-haspopup='listbox'
              aria-expanded={open}
            >
              {selectedOption ? (
                <span className={styles.displayText()}>{selectedOption.label}</span>
              ) : (
                <span className={styles.placeholder()}>{placeholder}</span>
              )}
              <IconChevronDown size='sm' color='muted' className={styles.chevron({ open })} />
            </button>
          }
          contentClassName={styles.content()}
        >
          <div role='listbox' aria-labelledby={selectId} onMouseDown={(e) => e.preventDefault()}>
            {options.map((option, index) => (
              <div
                key={option.value}
                role='option'
                aria-selected={option.value === currentValue}
                className={styles.option({
                  selected: option.value === currentValue,
                  highlighted: index === highlightedIndex,
                })}
                data-value={option.value}
                data-index={index}
                onClick={handleOptionClick}
                onMouseEnter={handleOptionMouseEnter}
              >
                {option.label}
              </div>
            ))}
          </div>
        </Popover>

        <FormError id={errorId} message={errorMessage} />
      </div>
    </ErrorBoundary>
  );
}

Select.validatorKey = 'select';
