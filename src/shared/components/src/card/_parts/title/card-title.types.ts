import type { VariantProps } from 'tailwind-variants';
import type { cardTitleVariants } from './card-title.variants';

export type CardTitleProps = React.ComponentProps<'h3'> & VariantProps<typeof cardTitleVariants>;
