import { useId } from 'react';
import { IconSpinner } from '../../icon';
import type { ButtonBaseProps } from './button.types';
import { buttonVariants } from './button.variants';

export function Button(props: ButtonBaseProps) {
  const { className, size, fullWidth, loading, icon, children, disabled, id, ref, ...rest } = props;

  const generatedId = useId();
  const buttonId = id || generatedId;
  const styles = buttonVariants({ size, fullWidth });
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      id={buttonId}
      data-slot='button'
      className={styles.root({ className })}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...rest}
    >
      {children}
      {loading ? <IconSpinner /> : icon}
    </button>
  );
}
