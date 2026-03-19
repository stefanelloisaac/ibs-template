import { useId } from 'react';
import { FormError } from '../../form';
import type { SwitchBaseProps } from './switch.types';
import { switchVariants } from './switch.variants';

export function Switch(props: SwitchBaseProps) {
  const { className, intent, size, fullWidth, labelPosition, label, disabled, errorMessage, id, ref, ...rest } = props;

  const generatedId = useId();
  const switchId = id || generatedId;
  const errorId = `${switchId}-error`;

  const resolvedIntent = errorMessage ? 'error' : intent;
  const styles = switchVariants({ size, intent: resolvedIntent, labelPosition, fullWidth, disabled });

  return (
    <div className={styles.wrapper()}>
      <div className={styles.root()}>
        <div className={styles.row()}>
          <label className={styles.control({ className })}>
            <input
              ref={ref}
              id={switchId}
              type='checkbox'
              role='switch'
              data-slot='switch'
              className={styles.input()}
              disabled={disabled}
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? errorId : undefined}
              {...rest}
            />
            <span className={styles.track()}>
              <span className={styles.thumb()} />
            </span>
          </label>

          {label && (
            <label htmlFor={switchId} className={styles.label()}>
              {label}
            </label>
          )}
        </div>
      </div>

      <FormError id={errorId} message={errorMessage} />
    </div>
  );
}
