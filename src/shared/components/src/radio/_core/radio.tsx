import { useId, useRef } from 'react';
import { useControllable } from '../../../hooks/use-controllable';
import { FormError } from '../../form';
import type { RadioBaseProps } from './radio.types';
import { radioVariants } from './radio.variants';

export function Radio(props: RadioBaseProps) {
  const {
    className,
    intent,
    orientation,
    fullWidth,
    label,
    options,
    value: controlledValue,
    defaultValue,
    onValueChange,
    name,
    required,
    disabled,
    errorMessage,
    id,
    ref,
    ...rest
  } = props;

  const generatedId = useId();
  const fieldsetId = id || generatedId;
  const errorId = `${fieldsetId}-error`;
  const hiddenRef = useRef<HTMLInputElement>(null);

  const [currentValue, setCurrentValue] = useControllable(controlledValue, defaultValue ?? '', onValueChange);

  const resolvedIntent = errorMessage ? 'error' : intent;
  const styles = radioVariants({ intent: resolvedIntent, orientation, fullWidth, disabled: !!disabled });

  const handleChange = (optionValue: string) => {
    setCurrentValue(optionValue);
  };

  return (
    <div className={styles.wrapper()}>
      <fieldset
        ref={ref}
        id={fieldsetId}
        data-slot='radio'
        className={styles.root({ className })}
        disabled={disabled}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? errorId : undefined}
        {...rest}
      >
        {label && (
          <legend className={styles.legend()}>
            {label}
            {required && <span aria-hidden='true'> *</span>}
          </legend>
        )}

        {name && (
          <input
            ref={hiddenRef}
            className='sr-only'
            tabIndex={-1}
            name={name}
            value={currentValue}
            required={required}
            onChange={() => {}}
          />
        )}

        <div className={styles.options()} role='radiogroup'>
          {options.map((option) => {
            const optionId = `${fieldsetId}-${option.value}`;
            return (
              <div key={option.value} className={styles.option()}>
                <div className={styles.control()}>
                  <input
                    id={optionId}
                    type='radio'
                    className={styles.input()}
                    checked={currentValue === option.value}
                    disabled={disabled || option.disabled}
                    onChange={() => handleChange(option.value)}
                  />
                  <span className={styles.indicator()} />
                </div>
                <label htmlFor={optionId} className={styles.label()}>
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      <FormError id={errorId} message={errorMessage} />
    </div>
  );
}

Radio.validatorKey = 'radio';
