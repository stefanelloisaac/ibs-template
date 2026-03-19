import type { VariantProps } from 'tailwind-variants';
import type { PopoverProps } from '../../popover/_core/popover.types';
import type { selectVariants } from './select.variants';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends VariantProps<typeof selectVariants>, Pick<PopoverProps, 'placement'> {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLButtonElement>;
}
