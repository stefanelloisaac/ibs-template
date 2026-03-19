import type { FormErrorProps } from './form-error.types';
import { formErrorVariants } from './form-error.variants';

export function FormError(props: FormErrorProps) {
  const { id, message, className } = props;

  if (!message) return null;

  const styles = formErrorVariants();

  return (
    <span id={id} className={styles.root({ className })} role='alert'>
      {message}
    </span>
  );
}
