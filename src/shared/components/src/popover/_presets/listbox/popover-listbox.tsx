import { useCallback, useRef, useState } from 'react';
import { useAnimationEnd } from '../../../../hooks/use-animation-end';
import { mergeRefs } from '../../../../lib/merge-refs';
import type { PopoverListboxProps } from './popover-listbox.types';
import { popoverListboxVariants } from './popover-listbox.variants';

export function PopoverListbox(props: PopoverListboxProps) {
  const { open, children, className, multiselectable, id, ref } = props;

  const internalRef = useRef<HTMLUListElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [prevOpen, setPrevOpen] = useState(false);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
    }
  }

  const handleClosingEnd = useCallback(() => {
    setShouldRender(false);
    setIsClosing(false);
  }, []);
  useAnimationEnd(internalRef, isClosing, handleClosingEnd);

  const styles = popoverListboxVariants();

  if (!shouldRender) return null;

  return (
    <ul
      ref={mergeRefs(internalRef, ref)}
      id={id}
      role='listbox'
      tabIndex={-1}
      aria-multiselectable={multiselectable || undefined}
      data-slot='popover-listbox'
      data-closing={isClosing ? '' : undefined}
      className={styles.root({ className })}
      onMouseDown={(e) => e.preventDefault()}
    >
      {children}
    </ul>
  );
}
