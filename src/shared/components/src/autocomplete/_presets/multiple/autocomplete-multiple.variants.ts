import { tv } from 'tailwind-variants';

export const autocompleteMultipleVariants = tv({
  slots: {
    tag: 'text-foreground bg-popover border-x-3 border-y border-primary rounded-md inline-flex items-center gap-1 px-1.5 py-0.5 text-sm shrink-0 animate-tag-in',
    tagButton: 'cursor-pointer rounded-md p-0.5 text-muted-foreground hover:bg-background hover:text-foreground',
    optionCheckbox: 'shrink-0',
  },
});
