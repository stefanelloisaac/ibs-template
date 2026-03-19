import type { VariantProps } from 'tailwind-variants';
import type { breadcrumbItemVariants } from './breadcrumb-item.variants';

type BreadcrumbItemCommon = VariantProps<typeof breadcrumbItemVariants>;

type BreadcrumbItemCurrentProps = Omit<React.ComponentProps<'span'>, 'children'> &
  BreadcrumbItemCommon & { current: true; href?: never };

type BreadcrumbItemLinkProps = Omit<React.ComponentProps<'a'>, 'children'> & BreadcrumbItemCommon & { current?: false };

export type BreadcrumbItemProps = (BreadcrumbItemCurrentProps | BreadcrumbItemLinkProps) & {
  children: React.ReactNode;
};
