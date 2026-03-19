import { useId } from 'react';
import type { CardDescriptionProps } from './card-description.types';
import { cardDescriptionVariants } from './card-description.variants';

export function CardDescription(props: CardDescriptionProps) {
  const { className, id, ref, ...rest } = props;

  const generatedId = useId();
  const descriptionId = id || generatedId;
  const styles = cardDescriptionVariants();

  return (
    <p ref={ref} id={descriptionId} data-slot='card-description' className={styles.root({ className })} {...rest} />
  );
}
