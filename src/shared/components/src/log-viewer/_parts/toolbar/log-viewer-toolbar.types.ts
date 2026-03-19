import type { LogSeverity } from '../../_core/log-viewer.types';

export type LogViewerToolbarBaseProps = {
  onSearch: (value: string) => void;
  activeSeverities: LogSeverity[];
  onSeverityToggle: (severity: LogSeverity) => void;
  enableSearch: boolean;
  enableFilter: boolean;
};
