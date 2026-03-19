import type { VariantProps } from 'tailwind-variants';
import type { loaderVariants } from './loader.variants';

export type LoaderBaseProps = React.ComponentProps<'div'> &
  VariantProps<typeof loaderVariants> & {
    message?: string;
  };
