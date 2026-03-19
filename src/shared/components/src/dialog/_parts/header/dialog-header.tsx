import { useId } from 'react';
import type { DialogHeaderProps } from './dialog-header.types';
import { dialogHeaderVariants } from './dialog-header.variants';

export function DialogHeader(props: DialogHeaderProps) {
  const { className, id, ref, ...rest } = props;

  const generatedId = useId();
  const headerId = id || generatedId;
  const styles = dialogHeaderVariants();

  return <div ref={ref} id={headerId} data-slot='dialog-header' className={styles.root({ className })} {...rest} />;
}
