import type { VariantProps } from 'tailwind-variants';
import type { LogEntry } from '../../_core/log-viewer.types';
import type { logViewerEntryVariants } from './log-viewer-entry.variants';

export type LogViewerEntryBaseProps = React.ComponentProps<'div'> &
  VariantProps<typeof logViewerEntryVariants> & {
    entry: LogEntry;
    formattedTimestamp: string;
  };
