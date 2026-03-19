import { tv } from 'tailwind-variants';

export const stepperVariants = tv({
  slots: {
    root: 'flex h-full',
    nav: 'flex w-60 shrink-0 flex-col p-2',
    step: 'flex gap-4',
    indicatorField: 'flex flex-col items-center',
    indicator: [
      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
      'text-sm font-medium',
      'transition-colors outline-none',
      'focus-visible:ring-ring/70 focus-visible:ring-[3px]',
    ],
    connector: 'w-0.5 flex-1 min-h-12 my-0 bg-border transition-colors duration-200',
    item: 'flex flex-1 items-start text-left',
    labelField: 'flex h-8 flex-col justify-center',
    label: 'text-base font-medium -mt-0.5',
    content: 'flex flex-1 flex-col min-h-0 min-w-0',
    panel: [
      'flex flex-col flex-1 min-h-0 overflow-y-auto',
      'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40',
    ],
    stepContent: 'flex-1 min-h-0 animate-step-in',
    actions: 'flex shrink-0 justify-end gap-4 border-border',
  },
  variants: {
    fullWidth: {
      true: { root: 'w-full' },
      false: { root: 'inline-flex' },
    },
    status: {
      completed: {
        indicator: 'bg-primary text-primary-foreground cursor-pointer hover:bg-primary/80',
        connector: 'bg-primary',
        label: 'text-foreground',
      },
      current: {
        indicator: 'border-2 border-primary text-primary cursor-default',
        connector: 'bg-border',
        label: 'text-foreground font-semibold',
      },
      upcoming: {
        indicator: 'border-2 border-muted-foreground text-muted-foreground cursor-not-allowed',
        connector: 'bg-border',
        label: 'text-muted-foreground',
      },
    },
  },
  defaultVariants: {
    status: 'upcoming',
    fullWidth: true,
  },
});
