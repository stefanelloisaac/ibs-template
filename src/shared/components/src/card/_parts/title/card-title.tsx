import { useId } from 'react';
import type { CardTitleProps } from './card-title.types';
import { cardTitleVariants } from './card-title.variants';

export function CardTitle(props: CardTitleProps) {
  const { className, size, id, ref, ...rest } = props;

  const generatedId = useId();
  const titleId = id || generatedId;
  const styles = cardTitleVariants({ size });

  return <h3 ref={ref} id={titleId} data-slot='card-title' className={styles.root({ className })} {...rest} />;
}
