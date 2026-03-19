import type { NotificationInternalItem } from '../../../store/notification/notification.types';
import type { NotificationGroup } from './notification-panel.types';

export const notificationPanelUtils = {
  groupByDate(notifications: NotificationInternalItem[]): NotificationGroup[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);

    const groups = new Map<string, NotificationInternalItem[]>();

    for (const notification of notifications) {
      const date = new Date(notification.timestamp);
      const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      let label: string;
      if (dateStart.getTime() === today.getTime()) {
        label = 'Hoje';
      } else if (dateStart.getTime() === yesterday.getTime()) {
        label = 'Ontem';
      } else {
        label = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
      }

      const group = groups.get(label);
      if (group) {
        group.push(notification);
      } else {
        groups.set(label, [notification]);
      }
    }

    return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
  },

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date);
  },
};
