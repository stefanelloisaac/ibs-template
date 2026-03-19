import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ErrorBoundary } from '../../../lib/error-boundary';
import { LogViewerEntry } from '../_parts/entry/log-viewer-entry';
import { LogViewerToolbar } from '../_parts/toolbar/log-viewer-toolbar';
import type { LogSeverity, LogViewerBaseProps } from './log-viewer.types';
import { logViewerUtils } from './log-viewer.utils';
import { logViewerVariants } from './log-viewer.variants';

const VIRTUALIZATION_THRESHOLD = 100;
const DEFAULT_OVERSCAN = 10;

export function LogViewer(props: LogViewerBaseProps) {
  const {
    className,
    autoScroll = true,
    enableSearch = true,
    enableFilter = true,
    virtualized,
    estimateRowHeight,
    timestampFormat,
    emptyMessage = 'Nenhum registro de log.',
    entries,
    id,
    ref,
    ...rest
  } = props;

  const generatedId = useId();
  const viewerId = id || generatedId;
  const styles = logViewerVariants();

  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isUserScrolledUp = useRef(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSeverities, setActiveSeverities] = useState<LogSeverity[]>([]);

  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const rowHeight = estimateRowHeight ?? 56;
  const shouldVirtualize = virtualized ?? entries.length > VIRTUALIZATION_THRESHOLD;

  const filteredEntries = useMemo(() => {
    let result = entries;
    if (activeSeverities.length > 0) {
      result = logViewerUtils.filterBySeverity(result, activeSeverities);
    }
    if (searchQuery) {
      result = logViewerUtils.searchEntries(result, searchQuery);
    }
    return logViewerUtils.sortByTimestampDesc(result);
  }, [entries, activeSeverities, searchQuery]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (shouldVirtualize) {
      setScrollTop(el.scrollTop);
    }

    const threshold = 40;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
    isUserScrolledUp.current = !isAtBottom;
  }, [shouldVirtualize]);

  useEffect(() => {
    if (autoScroll && !isUserScrolledUp.current && sentinelRef.current) {
      sentinelRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [entries.length, autoScroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !shouldVirtualize) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldVirtualize]);

  const { visibleEntries, paddingTop, paddingBottom } = useMemo(() => {
    if (!shouldVirtualize) {
      return { visibleEntries: filteredEntries, paddingTop: 0, paddingBottom: 0 };
    }

    const totalHeight = filteredEntries.length * rowHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - DEFAULT_OVERSCAN);
    const visibleCount = Math.ceil(containerHeight / rowHeight) + DEFAULT_OVERSCAN * 2;
    const endIndex = Math.min(filteredEntries.length, startIndex + visibleCount);

    return {
      visibleEntries: filteredEntries.slice(startIndex, endIndex),
      paddingTop: startIndex * rowHeight,
      paddingBottom: totalHeight - endIndex * rowHeight,
    };
  }, [shouldVirtualize, filteredEntries, scrollTop, containerHeight, rowHeight]);

  const handleSeverityToggle = useCallback((severity: LogSeverity) => {
    setActiveSeverities((prev) => (prev.includes(severity) ? prev.filter((s) => s !== severity) : [...prev, severity]));
  }, []);

  const formatTimestamp = useCallback(
    (date: Date) => {
      if (timestampFormat) return timestampFormat(date);
      return logViewerUtils.formatTimestamp(date);
    },
    [timestampFormat],
  );

  const showToolbar = enableSearch || enableFilter;

  return (
    <ErrorBoundary>
      <div ref={ref} id={viewerId} data-slot='log-viewer' className={styles.root({ className })} {...rest}>
        {showToolbar && (
          <LogViewerToolbar
            onSearch={setSearchQuery}
            activeSeverities={activeSeverities}
            onSeverityToggle={handleSeverityToggle}
            enableSearch={enableSearch}
            enableFilter={enableFilter}
          />
        )}
        <div ref={scrollRef} data-slot='log-viewer-scroll' className={styles.scrollArea()} onScroll={handleScroll}>
          {filteredEntries.length === 0 ? (
            <div className={styles.emptyState()}>{emptyMessage}</div>
          ) : (
            <>
              {shouldVirtualize && paddingTop > 0 && <div aria-hidden='true' style={{ height: paddingTop }} />}
              {visibleEntries.map((entry) => (
                <LogViewerEntry
                  key={entry.id}
                  entry={entry}
                  formattedTimestamp={formatTimestamp(logViewerUtils.toDate(entry.timestamp))}
                />
              ))}
              {shouldVirtualize && paddingBottom > 0 && <div aria-hidden='true' style={{ height: paddingBottom }} />}
            </>
          )}
          <div ref={sentinelRef} aria-hidden='true' />
        </div>
      </div>
    </ErrorBoundary>
  );
}
