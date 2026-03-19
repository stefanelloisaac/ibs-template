import { createElement } from 'react';
import { IconAlertTriangle, IconCheckCircle, IconInfoCircle, IconXCircle } from '../../icon';
import type { ToastIntent } from './toast.types';

const intentIconRegistry: Record<ToastIntent, React.ReactNode> = {
  success: createElement(IconCheckCircle, { size: 'sm', color: 'inherit' }),
  error: createElement(IconXCircle, { size: 'sm', color: 'inherit' }),
  warning: createElement(IconAlertTriangle, { size: 'sm', color: 'inherit' }),
  info: createElement(IconInfoCircle, { size: 'sm', color: 'inherit' }),
};

export const getIntentIcon = (intent: ToastIntent): React.ReactNode => {
  return intentIconRegistry[intent];
};
