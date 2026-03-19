import type { VariantProps } from 'tailwind-variants';
import type { IconBaseProps } from '../../_core/icon.types';
import type { iconUploadVariants } from './icon-upload.variants';

export type IconUploadProps = Omit<IconBaseProps, 'children'> & VariantProps<typeof iconUploadVariants>;
