import type { MouseEvent } from 'react';
import { useTheme } from '@/core/theme';

const SunIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='4' />
    <path d='M12 2v2' />
    <path d='M12 20v2' />
    <path d='m4.93 4.93 1.41 1.41' />
    <path d='m17.66 17.66 1.41 1.41' />
    <path d='M2 12h2' />
    <path d='M20 12h2' />
    <path d='m6.34 17.66-1.41 1.41' />
    <path d='m19.07 4.93-1.41 1.41' />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
  </svg>
);

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';

    if (!document.startViewTransition) {
      setMode(nextMode);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const goingDark = nextMode === 'dark';
    document.documentElement.dataset.themeTransition = goingDark ? 'reverse' : '';
    const transition = document.startViewTransition(() => setMode(nextMode));

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: goingDark
            ? [`circle(${radius}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`]
            : [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
        },
        {
          duration: 1000,
          easing: 'ease-in-out',
          fill: 'forwards',
          pseudoElement: goingDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
        },
      );
    });

    transition.finished.then(() => {
      delete document.documentElement.dataset.themeTransition;
    });
  };

  return (
    <button
      type='button'
      onClick={toggle}
      className='inline-flex cursor-pointer items-center gap-1.5 rounded-md border bg-primary px-2 py-1.5 text-sm text-primary-foreground transition-colors hover:bg-primary/80'
      title={mode === 'dark' ? 'Modo claro' : 'Modo escuro'}
    >
      {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
