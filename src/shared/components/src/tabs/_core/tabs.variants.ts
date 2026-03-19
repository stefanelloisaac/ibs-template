import { tv } from 'tailwind-variants';

export const tabsVariants = tv({
  slots: {
    root: 'flex flex-col h-full',
    list: 'relative flex items-center',
    indicator: 'absolute left-0 transition-all duration-200 ease-out',
    trigger: [
      'relative inline-flex items-center justify-center whitespace-nowrap',
      'text-sm font-medium transition-colors outline-none cursor-pointer',
      'disabled:pointer-events-none disabled:opacity-50',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'text-muted-foreground',
    ],
    content: [
      'mt-4 flex-1 min-h-0 animate-tab-in',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md',
    ],
  },
  variants: {
    fullWidth: {
      true: { root: 'w-full' },
      false: { root: 'inline-flex' },
    },
    variant: {
      underline: {
        list: 'border-b border-border',
        indicator: 'bottom-0 h-0.5 bg-primary',
        trigger: 'px-4 pb-2 data-[state=active]:text-primary',
      },
      enclosed: {
        list: 'bg-muted gap-1.5 border rounded-md p-1',
        indicator: 'top-1 h-[calc(100%-0.5rem)] rounded-md bg-primary shadow-sm',
        trigger:
          'rounded-md px-4 py-2 data-[state=inactive]:bg-background border data-[state=inactive]:border-border data-[state=active]:border-primary data-[state=active]:text-primary-foreground',
      },
    },
  },
  defaultVariants: {
    variant: 'enclosed',
    fullWidth: true,
  },
});
