import type { VariantProps } from 'tailwind-variants';
import type { labelVariants } from './label.variants';

export type LabelBaseProps = React.ComponentProps<'label'> &
  VariantProps<typeof labelVariants> & {
    required?: boolean;
  };
