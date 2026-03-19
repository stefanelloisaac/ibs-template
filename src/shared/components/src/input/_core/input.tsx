import { useId } from 'react';
import { FormError } from '../../form';
import { Label } from '../../label';
import type { InputBaseProps } from './input.types';
import { inputVariants } from './input.variants';

export function Input(props: InputBaseProps) {
  const { className, intent, fullWidth, label, children, required, errorMessage, id, ref, ...rest } = props;

  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  const resolvedIntent = errorMessage ? 'error' : intent;

  const styles = inputVariants({
    intent: resolvedIntent,
    fullWidth,
  });

  return (
    <div className={styles.root()}>
      {label && (
        <Label htmlFor={inputId} required={required} intent={resolvedIntent}>
          {label}
        </Label>
      )}

      <div className={styles.field()}>
        <input
          ref={ref}
          id={inputId}
          data-slot='input'
          className={styles.control({ className })}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? errorId : undefined}
          aria-required={required}
          required={required}
          {...rest}
        />
        {children}
      </div>

      <FormError id={errorId} message={errorMessage} />
    </div>
  );
}
