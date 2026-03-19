import type { LogEntry, LogSeverity } from './log-viewer.types';

export const logViewerUtils = {
  toDate(timestamp: Date | string): Date {
    return typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  },

  formatTimestamp(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  },

  sortByTimestampDesc(entries: LogEntry[]): LogEntry[] {
    return [...entries].sort((a, b) => {
      const dateA = logViewerUtils.toDate(a.timestamp).getTime();
      const dateB = logViewerUtils.toDate(b.timestamp).getTime();
      return dateB - dateA;
    });
  },

  filterBySeverity(entries: LogEntry[], activeSeverities: LogSeverity[]): LogEntry[] {
    if (activeSeverities.length === 0) return entries;
    return entries.filter((e) => activeSeverities.includes(e.severity));
  },

  searchEntries(entries: LogEntry[], query: string): LogEntry[] {
    if (!query.trim()) return entries;
    const lower = query.toLowerCase();
    return entries.filter(
      (e) =>
        e.message.toLowerCase().includes(lower) ||
        e.source?.toLowerCase().includes(lower) ||
        e.category?.toLowerCase().includes(lower),
    );
  },
};
