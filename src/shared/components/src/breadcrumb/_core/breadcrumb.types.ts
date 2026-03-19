import type { VariantProps } from 'tailwind-variants';
import type { breadcrumbVariants } from './breadcrumb.variants';

export type BreadcrumbBaseProps = React.ComponentProps<'nav'> &
  VariantProps<typeof breadcrumbVariants> & {
    separator?: React.ReactNode;
  };
