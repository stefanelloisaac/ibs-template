import type { VariantProps } from 'tailwind-variants';
import type { cardVariants } from './card.variants';

export type CardBaseProps = React.ComponentProps<'div'> & VariantProps<typeof cardVariants>;
