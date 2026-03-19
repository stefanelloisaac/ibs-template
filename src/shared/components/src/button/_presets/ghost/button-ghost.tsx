import { Button } from '../../_core/button';
import type { ButtonGhostProps } from './button-ghost.types';
import { buttonGhostVariants } from './button-ghost.variants';

export function ButtonGhost(props: ButtonGhostProps) {
  const { className, ...rest } = props;

  const styles = buttonGhostVariants();

  return <Button {...rest} className={styles.root({ className })} />;
}
