import type { VariantProps } from 'tailwind-variants';
import type { AutocompleteBaseProps, AutocompleteOption } from '../../_core/autocomplete.types';
import { autocompleteMultipleVariants } from './autocomplete-multiple.variants';

export type AutocompleteMultipleProps = Omit<
  AutocompleteBaseProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'serializedValue'
  | 'hasSelection'
  | 'closeOnSelect'
  | 'multiselectable'
  | 'onSelectHighlighted'
  | 'onBackspace'
  | 'onClear'
  | 'isOptionSelected'
  | 'renderOption'
  | 'beforeInput'
  | 'compound'
> &
  VariantProps<typeof autocompleteMultipleVariants> & {
    value?: AutocompleteOption[];
    defaultValue?: AutocompleteOption[];
    onValueChange?: (options: AutocompleteOption[]) => void;
  };
