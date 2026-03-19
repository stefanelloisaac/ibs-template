import type { IconBaseProps } from '../../icon/_core/icon.types';
import type { AutocompleteOption } from './autocomplete.types';

export const autocompleteUtils = {
  getOptionLabel(option: AutocompleteOption): string {
    return typeof option === 'string' ? option : option.label;
  },

  getOptionIcon(option: AutocompleteOption): React.ReactElement<IconBaseProps> | undefined {
    return typeof option === 'string' ? undefined : option.icon;
  },

  filterOptions(options: AutocompleteOption[], query: string): AutocompleteOption[] {
    if (!query.trim()) {
      return options;
    }

    const normalizedQuery = query.toLowerCase().trim();

    return options.filter((option) => {
      const label = autocompleteUtils.getOptionLabel(option);
      return label.toLowerCase().includes(normalizedQuery);
    });
  },
};
