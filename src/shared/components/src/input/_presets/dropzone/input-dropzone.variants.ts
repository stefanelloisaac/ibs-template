import { tv } from 'tailwind-variants';

export const inputDropzoneVariants = tv({
  slots: {
    root: 'relative flex flex-col gap-2 pb-5',
    dropzone: [
      'flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6',
      'cursor-pointer transition-colors',
      'text-muted-foreground text-sm',
    ],
    fileList: 'flex flex-col gap-2',
    fileItem: ['flex items-center justify-between gap-2 rounded-md border px-4 py-2', 'bg-muted/50 text-sm'],
    fileName: 'truncate',
    fileSize: 'text-muted-foreground text-xs shrink-0',
    removeButton: 'shrink-0 cursor-pointer text-muted-foreground hover:text-foreground transition-colors',
    label: 'text-sm',
    hint: 'text-xs text-muted-foreground/70',
  },
  variants: {
    dragging: {
      true: {
        dropzone: 'border-primary bg-primary/5',
      },
    },
    intent: {
      error: {
        dropzone: 'border-error',
      },
    },
    disabled: {
      true: {
        dropzone: 'opacity-50 pointer-events-none cursor-not-allowed',
      },
    },
  },
  defaultVariants: {
    dragging: false,
    disabled: false,
  },
});
