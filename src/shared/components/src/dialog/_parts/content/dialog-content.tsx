import { useId } from 'react';
import type { DialogContentProps } from './dialog-content.types';
import { dialogContentVariants } from './dialog-content.variants';

export function DialogContent(props: DialogContentProps) {
  const { className, id, ref, ...rest } = props;

  const generatedId = useId();
  const contentId = id || generatedId;
  const styles = dialogContentVariants();

  return <div ref={ref} id={contentId} data-slot='dialog-content' className={styles.root({ className })} {...rest} />;
}
