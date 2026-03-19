import { useId } from 'react';
import type { CardBaseProps } from './card.types';
import { cardVariants } from './card.variants';

export function Card(props: CardBaseProps) {
  const { className, padding, fullWidth, id, ref, ...rest } = props;

  const generatedId = useId();
  const cardId = id || generatedId;
  const styles = cardVariants({ padding, fullWidth });

  return <div ref={ref} id={cardId} data-slot='card' className={styles.root({ className })} {...rest} />;
}
