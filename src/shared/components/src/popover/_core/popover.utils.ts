import type { CSSProperties } from 'react';

type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export const popoverUtils = {
  getScrollParent: (el: HTMLElement): HTMLElement | Window => {
    let node = el.parentElement;

    while (node) {
      const { overflow, overflowX, overflowY } = getComputedStyle(node);
      if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) return node;
      node = node.parentElement;
    }

    return window;
  },

  getPortalPosition: (triggerEl: HTMLElement, placement: Placement): CSSProperties => {
    const rect = triggerEl.getBoundingClientRect();
    const gap = 4;

    const dialog = triggerEl.closest('dialog');
    const d = dialog?.getBoundingClientRect();
    const oT = d?.top ?? 0;
    const oL = d?.left ?? 0;
    const oR = d ? d.right : window.innerWidth;
    const oB = d ? d.bottom : window.innerHeight;

    switch (placement) {
      case 'bottom-start':
        return { position: 'fixed', top: rect.bottom - oT + gap, left: rect.left - oL };
      case 'bottom-end':
        return { position: 'fixed', top: rect.bottom - oT + gap, right: oR - rect.right };
      case 'top-start':
        return { position: 'fixed', bottom: oB - rect.top + gap, left: rect.left - oL };
      case 'top-end':
        return { position: 'fixed', bottom: oB - rect.top + gap, right: oR - rect.right };
    }
  },

  getPortalTarget: (el: HTMLElement): HTMLElement => {
    return el.closest('dialog') ?? document.body;
  },
};
