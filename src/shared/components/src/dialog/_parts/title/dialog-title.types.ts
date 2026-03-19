import type { VariantProps } from 'tailwind-variants';
import type { dialogTitleVariants } from './dialog-title.variants';

export type DialogTitleProps = React.ComponentProps<'h2'> & VariantProps<typeof dialogTitleVariants>;
