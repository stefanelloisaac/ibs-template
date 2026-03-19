import type { AutocompleteOption } from '../../_core/autocomplete.types';
import { autocompleteUtils } from '../../_core/autocomplete.utils';

export const autocompleteMultipleUtils = {
  isOptionSelected(option: AutocompleteOption, selected: AutocompleteOption[]): boolean {
    const optionLabel = autocompleteUtils.getOptionLabel(option);
    return selected.some((s) => autocompleteUtils.getOptionLabel(s) === optionLabel);
  },

  toggleOption(option: AutocompleteOption, selected: AutocompleteOption[]): AutocompleteOption[] {
    const optionLabel = autocompleteUtils.getOptionLabel(option);
    const isSelected = selected.some((s) => autocompleteUtils.getOptionLabel(s) === optionLabel);

    if (isSelected) {
      return selected.filter((s) => autocompleteUtils.getOptionLabel(s) !== optionLabel);
    }

    return [...selected, option];
  },

  removeOption(option: AutocompleteOption, selected: AutocompleteOption[]): AutocompleteOption[] {
    const optionLabel = autocompleteUtils.getOptionLabel(option);
    return selected.filter((s) => autocompleteUtils.getOptionLabel(s) !== optionLabel);
  },
};
