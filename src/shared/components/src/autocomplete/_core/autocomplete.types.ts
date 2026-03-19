import React from 'react';
import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../icon/_core/icon.types';
import type { autocompleteVariants } from './autocomplete.variants';

export type AutocompleteOption =
  | string
  | {
      label: string;
      icon?: React.ReactElement<IconBaseProps>;
    };

export type AutocompleteBaseProps = Omit<React.ComponentProps<'input'>, 'children'> &
  VariantProps<typeof autocompleteVariants> & {
    label?: string;
    errorMessage?: string;
    required?: boolean;
    options: AutocompleteOption[];
    emptyMessage?: string;
    beforeInput?: React.ReactNode;
    serializedValue?: string;
    hasSelection?: boolean;
    closeOnSelect?: boolean;
    multiselectable?: boolean;
    onSelectHighlighted?: (option: AutocompleteOption) => void;
    onBackspace?: () => boolean | void;
    onClear?: () => void;
    isOptionSelected?: (option: AutocompleteOption) => boolean;
    renderOption?: (option: AutocompleteOption, isSelected: boolean) => React.ReactNode;
  };
