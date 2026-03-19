import { cloneElement, useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAnimationEnd } from '../../../hooks/use-animation-end';
import { useClickOutside } from '../../../hooks/use-click-outside';
import { useControllable } from '../../../hooks/use-controllable';
import { useScrollDismiss } from '../../../hooks/use-scroll-dismiss';
import { ErrorBoundary } from '../../../lib/error-boundary';
import { mergeRefs } from '../../../lib/merge-refs';
import type { PopoverProps } from './popover.types';
import { popoverUtils } from './popover.utils';
import { popoverVariants } from './popover.variants';

export function Popover(props: PopoverProps) {
  const {
    className,
    contentClassName,
    placement,
    children,
    trigger,
    open: controlledOpen,
    defaultOpen,
    onOpenChange,
    disabled,
    portal,
    portalContainer,
    ref,
  } = props;

  type Phase = 'closed' | 'open' | 'closing';

  const [open, setOpen] = useControllable(controlledOpen, defaultOpen ?? false, onOpenChange);
  const [phase, setPhase] = useState<Phase>('closed');
  const [prevOpen, setPrevOpen] = useState(false);
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({});
  const [portalTarget, setPortalTarget] = useState<HTMLElement>(document.body);
  const [portalDark, setPortalDark] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentId = useId();

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setPhase('open');
    else if (phase !== 'closed') setPhase('closing');
  }

  const handleClosingEnd = useCallback(() => setPhase('closed'), []);
  useAnimationEnd(contentRef, phase === 'closing', handleClosingEnd);

  useClickOutside(portal ? [wrapperRef, contentRef] : wrapperRef, open, () => setOpen(false));

  useScrollDismiss(open, () => setOpen(false), {
    target: () => popoverUtils.getScrollParent(wrapperRef.current!),
  });

  useLayoutEffect(() => {
    if (!portal || phase === 'closed' || !wrapperRef.current) return;
    setPortalStyle(popoverUtils.getPortalPosition(wrapperRef.current, placement ?? 'bottom-end'));
    const resolvedTarget = portalContainer
      ? typeof portalContainer === 'function'
        ? portalContainer()
        : portalContainer
      : popoverUtils.getPortalTarget(wrapperRef.current);
    setPortalTarget(resolvedTarget);
    setPortalDark(wrapperRef.current.closest('.dark') !== null);
  }, [portal, portalContainer, phase, placement]);

  const styles = popoverVariants({ placement });

  const triggerElement = cloneElement(trigger, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      trigger.props.onClick?.(e);
      if (!disabled) setOpen(!open);
    },
    'aria-expanded': open,
    'aria-haspopup': trigger.props['aria-haspopup'] || 'dialog',
    'aria-controls': open ? contentId : undefined,
  });

  const contentNode = phase !== 'closed' && (
    <div
      ref={contentRef}
      id={contentId}
      data-slot='popover'
      tabIndex={-1}
      data-closing={phase === 'closing' ? '' : undefined}
      className={(portal ? styles.portalContent : styles.content)({ className: contentClassName })}
      style={portal ? portalStyle : undefined}
    >
      {children}
    </div>
  );

  return (
    <ErrorBoundary>
      <div ref={mergeRefs(wrapperRef, ref)} className={styles.root({ className })}>
        {triggerElement}
        {portal
          ? contentNode &&
            createPortal(portalDark ? <div className='dark contents'>{contentNode}</div> : contentNode, portalTarget)
          : contentNode}
      </div>
    </ErrorBoundary>
  );
}
