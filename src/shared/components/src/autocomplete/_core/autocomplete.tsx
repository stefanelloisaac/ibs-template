import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useArrowNavigation } from '../../../hooks/use-arrow-navigation';
import { useClickOutside } from '../../../hooks/use-click-outside';
import { ErrorBoundary } from '../../../lib/error-boundary';
import { mergeRefs } from '../../../lib/merge-refs';
import { FormError } from '../../form';
import { IconChevronDown, IconClose } from '../../icon';
import { Label } from '../../label';
import { PopoverListbox } from '../../popover';
import type { AutocompleteBaseProps } from './autocomplete.types';
import { autocompleteUtils } from './autocomplete.utils';
import { autocompleteVariants } from './autocomplete.variants';

export function Autocomplete(props: AutocompleteBaseProps) {
  const {
    className,
    intent,
    fullWidth,
    compound,
    label,
    placeholder,
    emptyMessage = 'Nenhum resultado encontrado',
    options,
    beforeInput,
    serializedValue = '',
    hasSelection = false,
    closeOnSelect = true,
    multiselectable,
    name,
    required,
    disabled,
    errorMessage,
    onChange,
    onBlur,
    onSelectHighlighted,
    onBackspace,
    onClear,
    isOptionSelected,
    renderOption,
    id,
    ref,
    ...rest
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const listboxId = useId();

  const resolvedIntent = errorMessage ? 'error' : intent;
  const resolvedFullWidth = fullWidth !== false;

  const filteredOptions = useMemo(() => autocompleteUtils.filterOptions(options, inputValue), [options, inputValue]);

  const styles = autocompleteVariants({
    intent: resolvedIntent,
    fullWidth: resolvedFullWidth,
    compound,
  });

  const openDropdown = () => setIsOpen(true);
  const closeDropdown = () => setIsOpen(false);

  const {
    highlightedIndex,
    setHighlightedIndex,
    onKeyDown: handleArrowNav,
  } = useArrowNavigation({
    count: filteredOptions.length,
    loop: false,
    onEscape: closeDropdown,
  });

  useClickOutside(containerRef, isOpen, closeDropdown);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedItem = listRef.current.children[highlightedIndex] as HTMLElement;
      highlightedItem?.scrollIntoView?.({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    openDropdown();
    setHighlightedIndex(-1);
    onChange?.(e);
  };

  const handleSelectOption = useCallback(
    (option: (typeof options)[number]) => {
      onSelectHighlighted?.(option);
      setInputValue('');
      setHighlightedIndex(-1);
      if (closeOnSelect) {
        closeDropdown();
      } else {
        inputRef.current?.focus();
      }
    },
    [onSelectHighlighted, closeOnSelect, setHighlightedIndex],
  );

  const handleOptionClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      const idx = Number(e.currentTarget.dataset.index);
      const option = filteredOptions[idx];
      if (option) handleSelectOption(option);
    },
    [filteredOptions, handleSelectOption],
  );

  const handleOptionMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      setHighlightedIndex(Number(e.currentTarget.dataset.index));
    },
    [setHighlightedIndex],
  );

  const handleClearAction = () => {
    onClear?.();
    setInputValue('');
    closeDropdown();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        if (!isOpen) {
          e.preventDefault();
          openDropdown();
          setHighlightedIndex(0);
          return;
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        }
        return;
      case 'Backspace':
        if (inputValue === '') {
          const shouldClose = onBackspace?.();
          if (shouldClose) closeDropdown();
          inputRef.current?.focus();
        }
        return;
      case 'Tab':
        closeDropdown();
        return;
    }
    handleArrowNav(e);
  };

  const handleFocus = () => {
    openDropdown();
  };

  const handleToggle = useCallback(() => {
    if (isOpen) closeDropdown();
    else openDropdown();
    inputRef.current?.focus();
  }, [isOpen]);

  const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    setInputValue('');
    if (hiddenRef.current && onBlur) {
      const event = { ...e, target: hiddenRef.current, currentTarget: hiddenRef.current };
      onBlur(event as unknown as React.FocusEvent<HTMLInputElement>);
    }
  };

  return (
    <ErrorBoundary>
      <div ref={mergeRefs(containerRef, ref)} className={styles.container()} onBlur={handleContainerBlur}>
        <span role='status' aria-live='polite' className='sr-only'>
          {isOpen ? `${filteredOptions.length} resultado(s) disponível(is)` : ''}
        </span>
        <input
          ref={hiddenRef}
          className='sr-only'
          tabIndex={-1}
          name={name}
          value={serializedValue}
          required={required}
          onChange={() => {}}
        />

        <div className={styles.root()}>
          {label && (
            <Label htmlFor={inputId} required={required} intent={resolvedIntent}>
              {label}
            </Label>
          )}

          <div className={styles.field()}>
            {beforeInput}
            <input
              ref={inputRef}
              id={inputId}
              type='text'
              role='combobox'
              data-slot='autocomplete'
              className={styles.control({ className })}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              placeholder={!hasSelection ? placeholder : undefined}
              disabled={disabled}
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? errorId : undefined}
              aria-required={required}
              aria-expanded={isOpen}
              aria-haspopup='listbox'
              aria-autocomplete='list'
              aria-controls={isOpen ? listboxId : undefined}
              aria-activedescendant={highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined}
              required={compound ? undefined : required}
              autoComplete='off'
              {...rest}
            />

            <div className={styles.actionsWrapper()}>
              {hasSelection && (
                <button
                  type='button'
                  onClick={handleClearAction}
                  className={styles.clearButton()}
                  aria-label='Limpar seleção'
                  disabled={disabled}
                >
                  <IconClose size='sm' color='muted' />
                </button>
              )}
              <button
                type='button'
                onClick={handleToggle}
                className={styles.toggleButton()}
                aria-label={isOpen ? 'Fechar lista' : 'Abrir lista'}
                tabIndex={-1}
                disabled={disabled}
              >
                <IconChevronDown size='sm' color='muted' className={styles.chevronIcon({ open: isOpen })} />
              </button>
            </div>

            <PopoverListbox open={isOpen} ref={listRef} id={listboxId} multiselectable={multiselectable}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const optionLabel = autocompleteUtils.getOptionLabel(option);
                  const isHighlighted = index === highlightedIndex;
                  const isSelected = isOptionSelected?.(option) ?? false;

                  return (
                    <li
                      key={optionLabel}
                      id={`${listboxId}-option-${index}`}
                      role='option'
                      aria-selected={isSelected}
                      data-slot='autocomplete-option'
                      className={styles.option({ className: isHighlighted ? styles.optionHighlighted() : '' })}
                      data-index={index}
                      onClick={handleOptionClick}
                      onMouseEnter={handleOptionMouseEnter}
                    >
                      {renderOption?.(option, isSelected)}
                    </li>
                  );
                })
              ) : (
                <li className={styles.emptyMessage()}>{emptyMessage}</li>
              )}
            </PopoverListbox>
          </div>

          <FormError id={errorId} message={errorMessage} />
        </div>
      </div>
    </ErrorBoundary>
  );
}
