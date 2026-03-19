import { useId, useState } from 'react';
import { FormError } from '../../form';
import { Label } from '../../label';
import type { TextareaBaseProps } from './textarea.types';
import { textareaVariants } from './textarea.variants';

export function Textarea(props: TextareaBaseProps) {
  const {
    className,
    intent,
    fullWidth,
    size,
    label,
    value,
    defaultValue,
    required,
    maxLength,
    errorMessage,
    onChange,
    id,
    ref,
    ...rest
  } = props;

  const generatedId = useId();
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;

  const resolvedIntent = errorMessage ? 'error' : intent;

  const styles = textareaVariants({
    intent: resolvedIntent,
    fullWidth,
    size,
  });

  const isControlled = value !== undefined;
  const [internalLength, setInternalLength] = useState(() => defaultValue?.toString().length ?? 0);

  const currentLength = isControlled ? (typeof value === 'string' ? value.length : 0) : internalLength;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setInternalLength(e.target.value.length);
    }
    onChange?.(e);
  };

  return (
    <div className={styles.root()}>
      <div className={styles.header()}>
        {label && (
          <Label htmlFor={textareaId} required={required} intent={resolvedIntent}>
            {label}
          </Label>
        )}

        <span className={styles.counter()}>
          {currentLength}/{maxLength}
        </span>
      </div>

      <textarea
        ref={ref}
        id={textareaId}
        data-slot='textarea'
        className={styles.control({ className })}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? errorId : undefined}
        aria-required={required}
        required={required}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        {...rest}
      />

      <FormError id={errorId} message={errorMessage} />
    </div>
  );
}

Textarea.validatorKey = 'textarea';
