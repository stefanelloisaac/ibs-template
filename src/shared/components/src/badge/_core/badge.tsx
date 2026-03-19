import { useId } from 'react';
import type { BadgeProps } from './badge.types';
import { badgeVariants } from './badge.variants';

export function Badge(props: BadgeProps) {
  const generatedId = useId();

  if (props.toggle) {
    const { className, intent, toggle: _, selected = false, onSelectedChange, onClick, id, ref, ...rest } = props;

    const badgeId = id || generatedId;
    const styles = badgeVariants({ intent, toggle: true, selected });

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onSelectedChange?.(!selected);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        id={badgeId}
        type='button'
        data-slot='badge'
        aria-pressed={selected}
        className={styles.root({ className })}
        onClick={handleClick}
        {...rest}
      />
    );
  }

  const { className, intent, toggle: _toggle, id, ref, ...rest } = props;
  const badgeId = id || generatedId;
  const styles = badgeVariants({ intent, toggle: false, selected: false });

  return <span ref={ref} id={badgeId} data-slot='badge' className={styles.root({ className })} {...rest} />;
}
