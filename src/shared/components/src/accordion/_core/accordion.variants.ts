import { tv } from 'tailwind-variants';

export const accordionVariants = tv({
  slots: {
    root: 'flex flex-col divide-y divide-border has-disabled:opacity-50 has-disabled:pointer-events-none',
    item: '',
    trigger: [
      'flex w-full items-center justify-between py-4 text-sm font-medium',
      'cursor-pointer hover:underline',
      '[&>svg]:transition-transform [&>svg]:duration-200',
      '[&[aria-expanded=true]>svg]:rotate-180',
    ],
    content: 'grid transition-[grid-template-rows] duration-200 ease-out',
    contentInner: 'overflow-hidden',
  },
  variants: {},
  defaultVariants: {},
});
