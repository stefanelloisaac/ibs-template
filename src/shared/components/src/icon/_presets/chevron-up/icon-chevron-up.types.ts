import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconChevronUpVariants } from './icon-chevron-up.variants';

export type IconChevronUpProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconChevronUpVariants>;
