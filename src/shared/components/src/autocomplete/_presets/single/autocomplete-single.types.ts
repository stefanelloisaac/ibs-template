import type { VariantProps } from 'tailwind-variants';
import type { AutocompleteBaseProps, AutocompleteOption } from '../../_core/autocomplete.types';
import { autocompleteSingleVariants } from './autocomplete-single.variants';

export type AutocompleteSingleProps = Omit<
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
  VariantProps<typeof autocompleteSingleVariants> & {
    value?: AutocompleteOption | null;
    defaultValue?: AutocompleteOption | null;
    onValueChange?: (option: AutocompleteOption | null) => void;
  };
