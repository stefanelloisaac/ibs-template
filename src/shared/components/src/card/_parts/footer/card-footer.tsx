import { useId } from 'react';
import type { CardFooterProps } from './card-footer.types';
import { cardFooterVariants } from './card-footer.variants';

export function CardFooter(props: CardFooterProps) {
  const { className, justify, id, ref, ...rest } = props;

  const generatedId = useId();
  const footerId = id || generatedId;
  const styles = cardFooterVariants({ justify });

  return <div ref={ref} id={footerId} data-slot='card-footer' className={styles.root({ className })} {...rest} />;
}
