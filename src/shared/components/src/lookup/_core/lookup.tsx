import { useId } from 'react';
import { ErrorBoundary } from '../../../lib/error-boundary';
import { FormError } from '../../form';
import { Label } from '../../label';
import type { LookupBaseProps } from './lookup.types';
import { lookupVariants } from './lookup.variants';

export function Lookup(props: LookupBaseProps) {
  const {
    className,
    intent,
    fullWidth,
    compound,
    label,
    placeholder,
    displayText,
    beforeInput,
    afterInput,
    required,
    disabled,
    errorMessage,
    onTriggerClick,
    id,
    ref,
    ...rest
  } = props;

  const generatedId = useId();
  const lookupId = id || generatedId;
  const errorId = `${lookupId}-error`;

  const resolvedIntent = errorMessage ? 'error' : intent;

  const styles = lookupVariants({ intent: resolvedIntent, fullWidth, compound });

  return (
    <ErrorBoundary>
      <div className={styles.root()}>
        {label && (
          <Label htmlFor={lookupId} required={required} intent={resolvedIntent}>
            {label}
          </Label>
        )}

        <div className={styles.field()}>
          <button
            ref={ref}
            id={lookupId}
            type='button'
            data-slot='lookup'
            className={styles.control({ className })}
            onClick={onTriggerClick}
            disabled={disabled}
            aria-invalid={!!errorMessage}
            aria-describedby={errorMessage ? errorId : undefined}
            aria-required={required}
            aria-haspopup='dialog'
            {...rest}
          >
            {beforeInput}
            {displayText && <span className={styles.displayText()}>{displayText}</span>}
            {!displayText && !beforeInput && <span className={styles.placeholder()}>{placeholder}</span>}
          </button>
          {afterInput}
        </div>

        <FormError id={errorId} message={errorMessage} />
      </div>
    </ErrorBoundary>
  );
}
