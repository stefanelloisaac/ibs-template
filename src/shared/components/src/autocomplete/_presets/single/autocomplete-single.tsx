import { cloneElement } from 'react';
import { useControllable } from '../../../../hooks/use-controllable';
import { IconClose } from '../../../icon';
import { Autocomplete } from '../../_core/autocomplete';
import type { AutocompleteOption } from '../../_core/autocomplete.types';
import { autocompleteUtils } from '../../_core/autocomplete.utils';
import type { AutocompleteSingleProps } from './autocomplete-single.types';
import { autocompleteSingleVariants } from './autocomplete-single.variants';

export function AutocompleteSingle(props: AutocompleteSingleProps) {
  const {
    options,
    emptyMessage,
    value,
    defaultValue,
    onValueChange,
    onBlur,
    name,
    required,
    className,
    fullWidth,
    placeholder,
    disabled,
    ...rest
  } = props;

  const [selectedOption, setSelectedOption] = useControllable<AutocompleteOption | null>(
    value,
    defaultValue ?? null,
    onValueChange,
  );

  const serializedValue = selectedOption ? autocompleteUtils.getOptionLabel(selectedOption) : '';
  const styles = autocompleteSingleVariants();

  const handleSelect = (option: AutocompleteOption) => {
    setSelectedOption(option);
  };

  const handleClear = () => {
    setSelectedOption(null);
  };

  const handleBackspace = () => {
    if (selectedOption) {
      handleClear();
      return true;
    }
  };

  const chipsSlot = selectedOption
    ? (() => {
        const optionLabel = autocompleteUtils.getOptionLabel(selectedOption);
        const optionIcon = autocompleteUtils.getOptionIcon(selectedOption);

        return (
          <span key={optionLabel} data-slot='autocomplete-chip' className={styles.tag()}>
            {optionIcon && cloneElement(optionIcon, { size: 'sm', color: 'muted' })}
            <span>{optionLabel}</span>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className={styles.tagButton()}
              aria-label={`Remover ${optionLabel}`}
              disabled={disabled}
            >
              <IconClose size='xs' color='muted' />
            </button>
          </span>
        );
      })()
    : null;

  return (
    <Autocomplete
      {...rest}
      options={options}
      emptyMessage={emptyMessage}
      fullWidth={fullWidth}
      compound
      required={required}
      className={className}
      name={name}
      placeholder={placeholder}
      disabled={disabled}
      onBlur={onBlur}
      serializedValue={serializedValue}
      hasSelection={!!selectedOption}
      closeOnSelect
      onSelectHighlighted={handleSelect}
      onBackspace={handleBackspace}
      onClear={handleClear}
      isOptionSelected={(option) =>
        selectedOption != null &&
        autocompleteUtils.getOptionLabel(option) === autocompleteUtils.getOptionLabel(selectedOption)
      }
      renderOption={(option) => {
        const optionIcon = autocompleteUtils.getOptionIcon(option);
        return (
          <>
            {optionIcon && cloneElement(optionIcon, { size: 'sm', color: 'muted' })}
            <span>{autocompleteUtils.getOptionLabel(option)}</span>
          </>
        );
      }}
      beforeInput={chipsSlot}
    />
  );
}

AutocompleteSingle.validatorKey = 'autocomplete-single';
