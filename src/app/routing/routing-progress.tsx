import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from 'react-router';

function getIncrement(n: number): number {
  if (n < 0.2) return 0.1;
  if (n < 0.5) return 0.04;
  if (n < 0.8) return 0.02;
  if (n < 0.99) return 0.005;
  return 0;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

const TRICKLE_SPEED = 200;
const DELAY = 150;
const COMPLETION_DELAY = 300;

export function RoutingProgress() {
  const navigation = useNavigation();
  const isLoading = navigation.state !== 'idle';

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (delayRef.current) clearTimeout(delayRef.current);
    if (trickleRef.current) clearInterval(trickleRef.current);
    if (completionRef.current) clearTimeout(completionRef.current);
    delayRef.current = null;
    trickleRef.current = null;
    completionRef.current = null;
  }, []);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    clearTimers();

    delayRef.current = setTimeout(() => {
      setProgress(0.08);
      setVisible(true);

      trickleRef.current = setInterval(() => {
        setProgress((prev) => clamp(prev + getIncrement(prev), 0, 0.994));
      }, TRICKLE_SPEED);
    }, DELAY);

    return clearTimers;
  }, [clearTimers, isLoading]);

  useEffect(() => {
    if (isLoading || !visible) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setProgress(1);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isLoading, visible]);

  useEffect(() => {
    if (isLoading || !visible || progress !== 1) {
      return;
    }

    completionRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, COMPLETION_DELAY);

    return () => {
      if (completionRef.current) {
        clearTimeout(completionRef.current);
      }

      completionRef.current = null;
    };
  }, [isLoading, progress, visible]);

  if (!visible) {
    return null;
  }

  const isComplete = progress === 1;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          background: 'var(--loading-bar-color, #3b82f6)',
          transition: isComplete ? 'width 200ms ease-out, opacity 200ms ease-out' : 'width 300ms ease-out',
          opacity: isComplete ? 0 : 1,
          borderRadius: '0 2px 2px 0',
          boxShadow: '0 0 8px var(--loading-bar-color, #3b82f6)',
        }}
      />
    </div>
  );
}
