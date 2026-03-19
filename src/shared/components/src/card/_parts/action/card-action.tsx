import { useId } from 'react';
import type { CardActionProps } from './card-action.types';
import { cardActionVariants } from './card-action.variants';

export function CardAction(props: CardActionProps) {
  const { className, id, ref, ...rest } = props;

  const generatedId = useId();
  const actionId = id || generatedId;
  const styles = cardActionVariants();

  return <div ref={ref} id={actionId} data-slot='card-action' className={styles.root({ className })} {...rest} />;
}
