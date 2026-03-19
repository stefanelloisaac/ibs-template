import { tv } from 'tailwind-variants';

export const chartLineVariants = tv({
  slots: {
    line: 'fill-none stroke-2',
    dot: 'stroke-2 cursor-pointer transition-[r] duration-150',
  },
  variants: {},
  defaultVariants: {},
});
