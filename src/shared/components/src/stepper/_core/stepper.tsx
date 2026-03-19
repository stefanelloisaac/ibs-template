import { Activity, useCallback, useId } from 'react';
import { ErrorBoundary } from '../../../lib/error-boundary';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../card';
import { IconCheck } from '../../icon';
import type { StepperBaseProps } from './stepper.types';
import { stepperVariants } from './stepper.variants';

export function Stepper(props: StepperBaseProps) {
  const { className, fullWidth, steps, actions, currentStep, onStepClick, id, ref, ...rest } = props;

  const generatedId = useId();
  const stepperId = id || generatedId;

  const focusFirst = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const focusable = node.querySelector<HTMLElement>(
      'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();
  }, []);

  const getStatus = (index: number): 'completed' | 'current' | 'upcoming' => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'upcoming';
  };

  const handleStepClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const idx = Number(e.currentTarget.dataset.index);
      onStepClick?.(idx);
    },
    [onStepClick],
  );

  const styles = stepperVariants({ fullWidth });

  return (
    <ErrorBoundary>
      <div ref={ref} id={stepperId} data-slot='stepper' className={styles.root({ className })} {...rest}>
        <nav className={styles.nav()} aria-label='Progress'>
          {steps.map((step, index) => {
            const status = getStatus(index);
            const itemStyles = stepperVariants({ status });
            const isClickable = status === 'completed' && onStepClick;
            const isLast = index === steps.length - 1;

            return (
              <div key={index} className={styles.step()}>
                <div className={itemStyles.indicatorField()}>
                  <button
                    type='button'
                    className={itemStyles.indicator()}
                    disabled={!isClickable}
                    data-index={index}
                    onClick={handleStepClick}
                    aria-current={status === 'current' ? 'step' : undefined}
                    aria-label={`Step ${index + 1}: ${step.label}`}
                  >
                    {status === 'completed' ? <IconCheck size='sm' color='inherit' /> : index + 1}
                  </button>
                  {!isLast && <span className={itemStyles.connector()} />}
                </div>
                <div className={itemStyles.item()}>
                  <span className={itemStyles.labelField()}>
                    <span className={itemStyles.label()}>{step.label}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </nav>

        <Card className={styles.content()}>
          <CardHeader>
            <CardTitle>{steps[currentStep].label}</CardTitle>
            {steps[currentStep].description && <CardDescription>{steps[currentStep].description}</CardDescription>}
            <CardAction>
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
            </CardAction>
          </CardHeader>

          <CardContent className={styles.panel()}>
            {steps.map((step, index) => (
              <Activity key={index} mode={index === currentStep ? 'visible' : 'hidden'}>
                <div className={styles.stepContent()} ref={index === currentStep ? focusFirst : undefined}>
                  {step.content}
                </div>
              </Activity>
            ))}
          </CardContent>

          {actions && <CardFooter className={styles.actions()}>{actions}</CardFooter>}
        </Card>
      </div>
    </ErrorBoundary>
  );
}
