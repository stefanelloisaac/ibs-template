import type { VariantProps } from 'tailwind-variants';
import type { accordionVariants } from './accordion.variants';

export type AccordionItem = {
  value: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
};

export type AccordionBaseProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof accordionVariants> & {
    items: AccordionItem[];
    disabled?: boolean;
  } & (
    | {
        type?: 'single';
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
      }
    | {
        type: 'multiple';
        value?: string[];
        defaultValue?: string[];
        onValueChange?: (value: string[]) => void;
      }
  );
