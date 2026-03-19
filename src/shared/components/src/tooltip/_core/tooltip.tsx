import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useAnimationEnd } from '../../../hooks/use-animation-end';
import { useScrollDismiss } from '../../../hooks/use-scroll-dismiss';
import { ErrorBoundary } from '../../../lib/error-boundary';
import { mergeRefs } from '../../../lib/merge-refs';
import type { TooltipBaseProps } from './tooltip.types';
import { tooltipUtils } from './tooltip.utils';
import { tooltipVariants } from './tooltip.variants';

export function Tooltip(props: TooltipBaseProps) {
  const { className, placement = 'top', delay = 200, content, children, id, ref, ...rest } = props;

  const generatedId = useId();
  const tooltipId = id || `tooltip-${generatedId}`;
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [resolvedPlacement, setResolvedPlacement] = useState(placement);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (triggerRef.current) {
        setResolvedPlacement(tooltipUtils.getFlippedPlacement(triggerRef.current, placement));
      }
      setIsClosing(false);
      setIsVisible(true);
    }, delay);
  }, [delay, placement]);

  const isVisibleRef = useRef(false);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isVisibleRef.current) setIsClosing(true);
    else setIsVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClosingEnd = useCallback(() => {
    setIsClosing(false);
    setIsVisible(false);
  }, []);

  useAnimationEnd(tooltipRef, isClosing, handleClosingEnd);
  useScrollDismiss(isVisible, hide, { capture: true });

  const styles = tooltipVariants({ placement: resolvedPlacement });

  return (
    <ErrorBoundary>
      <div
        ref={mergeRefs(triggerRef, ref)}
        className={styles.root({ className })}
        aria-describedby={isVisible ? tooltipId : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        {...rest}
      >
        {children}
        {(isVisible || isClosing) && (
          <div
            ref={tooltipRef}
            id={tooltipId}
            role='tooltip'
            data-slot='tooltip'
            data-closing={isClosing ? '' : undefined}
            className={styles.tooltip()}
          >
            {content}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
