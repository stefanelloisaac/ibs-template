import { useId } from 'react';
import type { CardContentProps } from './card-content.types';
import { cardContentVariants } from './card-content.variants';

export function CardContent(props: CardContentProps) {
  const { className, id, ref, ...rest } = props;

  const generatedId = useId();
  const contentId = id || generatedId;
  const styles = cardContentVariants();

  return <div ref={ref} id={contentId} data-slot='card-content' className={styles.root({ className })} {...rest} />;
}
