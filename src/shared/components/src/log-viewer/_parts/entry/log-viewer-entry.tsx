import { useState } from 'react';
import { IconChevronDown } from '../../../icon';
import { getSeverityIcon } from '../../_core/log-viewer.registry';
import type { LogViewerEntryBaseProps } from './log-viewer-entry.types';
import { logViewerEntryVariants } from './log-viewer-entry.variants';

export function LogViewerEntry(props: LogViewerEntryBaseProps) {
  const { entry, formattedTimestamp, className, ...rest } = props;

  const [expanded, setExpanded] = useState(false);
  const styles = logViewerEntryVariants({ severity: entry.severity });
  const hasDetail = !!entry.detail;

  return (
    <div data-slot='log-viewer-entry' className={styles.root({ className })} {...rest}>
      <div className={styles.row()}>
        <span className={styles.timestamp()}>{formattedTimestamp}</span>
        <span className={styles.icon()}>{getSeverityIcon(entry.severity)}</span>
        <div className={styles.content()}>
          <p className={styles.message()}>{entry.message}</p>
          {entry.source && <p className={styles.source()}>{entry.source}</p>}
        </div>
        {hasDetail && (
          <button
            type='button'
            className={styles.expandButton()}
            onClick={() => setExpanded((p) => !p)}
            aria-expanded={expanded}
            aria-label='Detalhes'
          >
            <IconChevronDown
              size='xs'
              color='inherit'
              className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>
      {hasDetail && (
        <div className={styles.detail()} style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}>
          <div className={styles.detailInner()}>
            <div className={styles.detailContent()}>{entry.detail}</div>
          </div>
        </div>
      )}
    </div>
  );
}
