import { useId } from 'react';
import { FormError } from '../../form';
import { IconCheck } from '../../icon';
import type { CheckboxBaseProps } from './checkbox.types';
import { checkboxVariants } from './checkbox.variants';

export function Checkbox(props: CheckboxBaseProps) {
  const { className, intent, labelPosition, fullWidth, label, disabled, errorMessage, id, ref, ...rest } = props;

  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  const resolvedIntent = errorMessage ? 'error' : intent;
  const styles = checkboxVariants({ intent: resolvedIntent, labelPosition, fullWidth, disabled });

  return (
    <div className={styles.wrapper()}>
      <div className={styles.root()}>
        <div className={styles.row()}>
          <div className={styles.control()}>
            <input
              ref={ref}
              id={inputId}
              type='checkbox'
              data-slot='checkbox'
              className={styles.input({ className })}
              disabled={disabled}
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? errorId : undefined}
              {...rest}
            />
            <IconCheck size='xs' className={styles.icon()} />
          </div>

          {label && (
            <label htmlFor={inputId} className={styles.label()}>
              {label}
            </label>
          )}
        </div>
      </div>

      <FormError id={errorId} message={errorMessage} />
    </div>
  );
}

Checkbox.validatorKey = 'checkbox';
