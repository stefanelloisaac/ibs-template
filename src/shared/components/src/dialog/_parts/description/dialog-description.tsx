import { useId } from 'react';
import type { DialogDescriptionProps } from './dialog-description.types';
import { dialogDescriptionVariants } from './dialog-description.variants';

export function DialogDescription(props: DialogDescriptionProps) {
  const { className, id, ref, ...rest } = props;

  const generatedId = useId();
  const descriptionId = id || generatedId;
  const styles = dialogDescriptionVariants();

  return (
    <p ref={ref} id={descriptionId} data-slot='dialog-description' className={styles.root({ className })} {...rest} />
  );
}
