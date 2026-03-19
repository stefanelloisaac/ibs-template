import { useId } from 'react';
import type { DialogTitleProps } from './dialog-title.types';
import { dialogTitleVariants } from './dialog-title.variants';

export function DialogTitle(props: DialogTitleProps) {
  const { className, size, id, ref, ...rest } = props;

  const generatedId = useId();
  const titleId = id || generatedId;
  const styles = dialogTitleVariants({ size });

  return <h2 ref={ref} id={titleId} data-slot='dialog-title' className={styles.root({ className })} {...rest} />;
}
