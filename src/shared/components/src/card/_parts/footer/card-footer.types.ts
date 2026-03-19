import type { VariantProps } from 'tailwind-variants';
import type { cardFooterVariants } from './card-footer.variants';

export type CardFooterProps = React.ComponentProps<'div'> & VariantProps<typeof cardFooterVariants>;
