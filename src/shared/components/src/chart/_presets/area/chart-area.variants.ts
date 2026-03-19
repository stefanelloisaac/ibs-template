import { tv } from 'tailwind-variants';

export const chartAreaVariants = tv({
  slots: {
    line: 'fill-none stroke-2',
    area: 'stroke-none opacity-20',
    dot: 'stroke-2 cursor-pointer transition-[r] duration-150',
  },
  variants: {},
  defaultVariants: {},
});
