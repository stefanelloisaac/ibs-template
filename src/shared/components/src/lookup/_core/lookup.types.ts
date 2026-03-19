import type { VariantProps } from 'tailwind-variants';
import type { lookupVariants } from './lookup.variants';

export type LookupBaseProps = Omit<React.ComponentProps<'button'>, 'children'> &
  VariantProps<typeof lookupVariants> & {
    label?: string;
    errorMessage?: string;
    required?: boolean;
    placeholder?: string;
    displayText?: string;
    onTriggerClick?: () => void;
    beforeInput?: React.ReactNode;
    afterInput?: React.ReactNode;
  };
