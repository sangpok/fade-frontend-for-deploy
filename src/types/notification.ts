import { IconType } from 'react-icons/lib';

export type TNotificationType = 'FEED_REPORTED' | 'FEED_DELETED' | 'FAP_SELECTED' | 'FAP_DELETED';

interface TNotificationBase {
  id: number;
  type: TNotificationType;
  isRead: boolean;
  createdAt: Date;

  feedId?: number;
  reportCount?: number;
  selectedDate?: Date;
  deletedFAPCount?: number;
}

interface TNotificationFeedReported extends TNotificationBase {
  type: 'FEED_REPORTED';
  feedId: number;
  reportCount: number;
}

interface TNotificationFeedDeleted extends TNotificationBase {
  type: 'FEED_DELETED';
}

interface TNotificationFAPSelected extends TNotificationBase {
  type: 'FAP_SELECTED';
  selectedDate: Date;
}

interface TNotificationFAPDeleted extends TNotificationBase {
  type: 'FAP_DELETED';
  deletedFAPCount: number;
}

export type TNotification = TNotificationFeedReported | TNotificationFeedDeleted | TNotificationFAPSelected | TNotificationFAPDeleted;

export function isFeedReportedNotification(notification: TNotification): notification is TNotificationFeedReported {
  return notification.type === 'FEED_REPORTED';
}

export function isFeedDeletedNotification(notification: TNotification): notification is TNotificationFeedDeleted {
  return notification.type === 'FEED_DELETED';
}

export function isFAPSelectedNotification(notification: TNotification): notification is TNotificationFAPSelected {
  return notification.type === 'FAP_SELECTED';
}

export function isFAPDeletedNotification(notification: TNotification): notification is TNotificationFAPDeleted {
  return notification.type === 'FAP_DELETED';
}

export type NotificationData<T extends TNotificationType> = {
  IconComponent: IconType;
  iconColor: string;
  getMessage: T extends 'FEED_REPORTED'
    ? (count: number) => string
    : T extends 'FEED_DELETED'
      ? () => string
      : T extends 'FAP_SELECTED'
        ? (date: string) => string
        : T extends 'FAP_DELETED'
          ? (count: number) => string
          : never;
};

export type NotificationDataMap = {
  [K in TNotificationType]: NotificationData<K>;
};
