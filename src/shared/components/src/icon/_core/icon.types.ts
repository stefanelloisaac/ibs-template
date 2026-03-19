import type { VariantProps } from 'tailwind-variants';
import type { iconVariants } from './icon.variants';

export type IconBaseProps = React.ComponentProps<'svg'> & VariantProps<typeof iconVariants>;
