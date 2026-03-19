import type { VariantProps } from 'tailwind-variants';
import type { badgeVariants } from './badge.variants';

type BadgeCommon = Pick<VariantProps<typeof badgeVariants>, 'intent'>;

type BadgeToggleProps = React.ComponentProps<'button'> &
  BadgeCommon & {
    toggle: true;
    selected?: boolean;
    onSelectedChange?: (selected: boolean) => void;
  };

type BadgeStaticProps = React.ComponentProps<'span'> &
  BadgeCommon & {
    toggle?: false;
  };

export type BadgeProps = BadgeToggleProps | BadgeStaticProps;
