import type { TooltipPlacement } from './tooltip.types';

export const tooltipUtils = {
  MARGIN: 8,

  getFlippedPlacement: (triggerEl: HTMLElement, preferred: TooltipPlacement): TooltipPlacement => {
    const rect = triggerEl.getBoundingClientRect();

    switch (preferred) {
      case 'top':
        if (rect.top < 40 + tooltipUtils.MARGIN) return 'bottom';
        break;
      case 'bottom':
        if (rect.bottom > window.innerHeight - 40 - tooltipUtils.MARGIN) return 'top';
        break;
      case 'left':
        if (rect.left < 100 + tooltipUtils.MARGIN) return 'right';
        break;
      case 'right':
        if (rect.right > window.innerWidth - 100 - tooltipUtils.MARGIN) return 'left';
        break;
    }

    return preferred;
  },
};
