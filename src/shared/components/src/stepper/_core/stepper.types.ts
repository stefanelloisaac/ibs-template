import type { VariantProps } from 'tailwind-variants';
import type { stepperVariants } from './stepper.variants';

export type StepperStep = {
  label: string;
  description?: string;
  content: React.ReactNode;
};

export type StepperBaseProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof stepperVariants> & {
    steps: StepperStep[];
    currentStep: number;
    onStepClick?: (step: number) => void;
    actions?: React.ReactNode;
  };
