import type { VariantProps } from 'tailwind-variants';
import type { logViewerVariants } from './log-viewer.variants';

export type LogSeverity = 'success' | 'error' | 'warning' | 'info';

export type LogEntry = {
  id: string;
  timestamp: Date | string;
  severity: LogSeverity;
  message: string;
  source?: string;
  category?: string;
  detail?: React.ReactNode;
  data?: Record<string, unknown>;
};

export type LogViewerBaseProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof logViewerVariants> & {
    entries: LogEntry[];
    autoScroll?: boolean;
    enableSearch?: boolean;
    enableFilter?: boolean;
    virtualized?: boolean;
    estimateRowHeight?: number;
    timestampFormat?: (date: Date) => string;
    emptyMessage?: string;
  };
