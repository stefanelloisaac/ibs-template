import { useId } from 'react';
import type { CardHeaderProps } from './card-header.types';
import { cardHeaderVariants } from './card-header.variants';

export function CardHeader(props: CardHeaderProps) {
  const { className, id, ref, ...rest } = props;

  const generatedId = useId();
  const headerId = id || generatedId;
  const styles = cardHeaderVariants();

  return <div ref={ref} id={headerId} data-slot='card-header' className={styles.root({ className })} {...rest} />;
}
