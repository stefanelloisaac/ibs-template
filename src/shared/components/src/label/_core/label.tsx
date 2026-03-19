import { useId } from 'react';
import type { LabelBaseProps } from './label.types';
import { labelVariants } from './label.variants';

export function Label(props: LabelBaseProps) {
  const { className, size, intent, children, required, id, ref, ...rest } = props;

  const generatedId = useId();
  const labelId = id || generatedId;
  const styles = labelVariants({ size, intent });

  return (
    <label ref={ref} id={labelId} data-slot='label' className={styles.root({ className })} {...rest}>
      {children}
      {required && <span aria-hidden='true'> *</span>}
    </label>
  );
}
