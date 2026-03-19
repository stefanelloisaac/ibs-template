import { createElement } from 'react';
import type { NotificationIntent } from '../../../store/notification/notification.types';
import { IconAlertTriangle, IconCheckCircle, IconInfoCircle, IconXCircle } from '../../icon';

const intentIconRegistry: Record<NotificationIntent, React.ReactNode> = {
  success: createElement(IconCheckCircle, { size: 'sm', color: 'inherit' }),
  error: createElement(IconXCircle, { size: 'sm', color: 'inherit' }),
  warning: createElement(IconAlertTriangle, { size: 'sm', color: 'inherit' }),
  info: createElement(IconInfoCircle, { size: 'sm', color: 'inherit' }),
};

export const getIntentIcon = (intent: NotificationIntent): React.ReactNode => {
  return intentIconRegistry[intent];
};
