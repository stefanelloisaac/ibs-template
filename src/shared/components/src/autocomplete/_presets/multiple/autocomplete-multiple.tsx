import { cloneElement } from 'react';
import { useControllable } from '../../../../hooks/use-controllable';
import { IconCheckbox, IconClose } from '../../../icon';
import { Autocomplete } from '../../_core/autocomplete';
import type { AutocompleteOption } from '../../_core/autocomplete.types';
import { autocompleteUtils } from '../../_core/autocomplete.utils';
import type { AutocompleteMultipleProps } from './autocomplete-multiple.types';
import { autocompleteMultipleUtils } from './autocomplete-multiple.utils';
import { autocompleteMultipleVariants } from './autocomplete-multiple.variants';

export function AutocompleteMultiple(props: AutocompleteMultipleProps) {
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

  const [selectedOptions, setSelectedOptions] = useControllable<AutocompleteOption[]>(
    value,
    defaultValue ?? [],
    onValueChange,
  );

  const serializedValue = selectedOptions.map((o) => autocompleteUtils.getOptionLabel(o)).join(',');
  const styles = autocompleteMultipleVariants();

  const handleSelect = (option: AutocompleteOption) => {
    const newSelected = autocompleteMultipleUtils.toggleOption(option, selectedOptions);
    setSelectedOptions(newSelected);
  };

  const handleRemove = (option: AutocompleteOption) => {
    const newSelected = autocompleteMultipleUtils.removeOption(option, selectedOptions);
    setSelectedOptions(newSelected);
  };

  const handleClear = () => {
    setSelectedOptions([]);
  };

  const handleBackspace = () => {
    if (selectedOptions.length > 0) {
      handleRemove(selectedOptions[selectedOptions.length - 1]);
    }
  };

  const chipsSlot =
    selectedOptions.length > 0
      ? selectedOptions.map((option) => {
          const optionLabel = autocompleteUtils.getOptionLabel(option);
          const optionIcon = autocompleteUtils.getOptionIcon(option);

          return (
            <span key={optionLabel} data-slot='autocomplete-chip' className={styles.tag()}>
              {optionIcon && cloneElement(optionIcon, { size: 'sm', color: 'muted' })}
              <span>{optionLabel}</span>
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(option);
                }}
                className={styles.tagButton()}
                aria-label={`Remover ${optionLabel}`}
                disabled={disabled}
              >
                <IconClose size='xs' color='muted' />
              </button>
            </span>
          );
        })
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
      hasSelection={selectedOptions.length > 0}
      closeOnSelect={false}
      multiselectable
      onSelectHighlighted={handleSelect}
      onBackspace={handleBackspace}
      onClear={handleClear}
      isOptionSelected={(option) => autocompleteMultipleUtils.isOptionSelected(option, selectedOptions)}
      renderOption={(option, isSelected) => {
        const optionIcon = autocompleteUtils.getOptionIcon(option);
        return (
          <>
            <IconCheckbox size='sm' color='primary' className={styles.optionCheckbox()} checked={isSelected} />
            {optionIcon && cloneElement(optionIcon, { size: 'sm', color: 'muted' })}
            <span>{autocompleteUtils.getOptionLabel(option)}</span>
          </>
        );
      }}
      beforeInput={chipsSlot}
    />
  );
}

AutocompleteMultiple.validatorKey = 'autocomplete-multiple';
