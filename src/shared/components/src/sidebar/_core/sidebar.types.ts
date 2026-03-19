import type { VariantProps } from 'tailwind-variants';
import type { sidebarVariants } from './sidebar.variants';

export type SidebarChildItem = {
  label: string;
  href: string;
};

export type SidebarSubItem = {
  label: string;
  href?: string;
  description?: string;
  children?: SidebarChildItem[];
};

export type SidebarModule = {
  id: string;
  label: string;
  icon: React.ReactNode;
  subItems: SidebarSubItem[];
};

export type SidebarBaseProps = Omit<React.ComponentProps<'div'>, 'children'> & VariantProps<typeof sidebarVariants>;
