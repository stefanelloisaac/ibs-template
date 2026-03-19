import { createElement } from 'react';
import { IconAlertTriangle, IconCheckCircle, IconInfoCircle, IconXCircle } from '../../icon';
import type { LogSeverity } from './log-viewer.types';

const severityIconRegistry: Record<LogSeverity, React.ReactNode> = {
  success: createElement(IconCheckCircle, { size: 'sm', color: 'inherit' }),
  error: createElement(IconXCircle, { size: 'sm', color: 'inherit' }),
  warning: createElement(IconAlertTriangle, { size: 'sm', color: 'inherit' }),
  info: createElement(IconInfoCircle, { size: 'sm', color: 'inherit' }),
};

export const getSeverityIcon = (severity: LogSeverity): React.ReactNode => {
  return severityIconRegistry[severity];
};
