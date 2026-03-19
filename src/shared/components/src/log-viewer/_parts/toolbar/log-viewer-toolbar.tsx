import { Badge } from '../../../badge';
import { InputSearch } from '../../../input';
import type { LogSeverity } from '../../_core/log-viewer.types';
import type { LogViewerToolbarBaseProps } from './log-viewer-toolbar.types';
import { logViewerToolbarVariants } from './log-viewer-toolbar.variants';

const severityLabels: Record<LogSeverity, string> = {
  success: 'Sucesso',
  error: 'Erro',
  warning: 'Alerta',
  info: 'Info',
};

const severities: LogSeverity[] = ['success', 'error', 'warning', 'info'];

export function LogViewerToolbar(props: LogViewerToolbarBaseProps) {
  const { onSearch, activeSeverities, onSeverityToggle, enableSearch, enableFilter } = props;

  const styles = logViewerToolbarVariants();

  return (
    <div data-slot='log-viewer-toolbar' className={styles.root()}>
      {enableSearch && (
        <div className={styles.searchWrapper()}>
          <InputSearch onSearch={onSearch} placeholder='Buscar nos logs...' />
        </div>
      )}
      {enableFilter && (
        <div className={styles.filterGroup()}>
          {severities.map((severity) => (
            <Badge
              key={severity}
              toggle
              intent={severity}
              selected={activeSeverities.includes(severity)}
              onSelectedChange={() => onSeverityToggle(severity)}
            >
              {severityLabels[severity]}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
