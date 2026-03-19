import type { VariantProps } from 'tailwind-variants';
import type { dialogFooterVariants } from './dialog-footer.variants';

export type DialogFooterProps = React.ComponentProps<'div'> & VariantProps<typeof dialogFooterVariants>;
