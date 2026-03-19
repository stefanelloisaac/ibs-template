import { useId } from 'react';
import { ErrorBoundary } from '../../../lib/error-boundary';
import { FormError } from '../../form';
import { Label } from '../../label';
import type { PeriodBaseProps } from './period.types';
import { periodVariants } from './period.variants';

export function Period(props: PeriodBaseProps) {
  const { className, fullWidth, label, children, required, disabled, errorMessage, id, ref, ...rest } = props;

  const generatedId = useId();
  const baseId = id || generatedId;
  const errorId = `${baseId}-error`;

  const resolvedIntent = errorMessage ? 'error' : undefined;

  const styles = periodVariants({ fullWidth });

  return (
    <ErrorBoundary>
      <div ref={ref} id={baseId} data-slot='period' className={styles.root({ className })} {...rest}>
        {disabled && <input disabled hidden />}
        {label && (
          <Label required={required} intent={resolvedIntent}>
            {label}
          </Label>
        )}

        <div className={styles.fields()}>{children}</div>

        <FormError id={errorId} message={errorMessage} />
      </div>
    </ErrorBoundary>
  );
}
