import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import {
  isFAPDeletedNotification,
  isFAPSelectedNotification,
  isFeedDeletedNotification,
  isFeedReportedNotification,
  NotificationDataMap,
  TNotification,
} from '@Types/notification';
import { cn, getRelativeTimeLabel } from '@Utils/index';
import { subDays, subMonths } from 'date-fns';
import { FaCrown } from 'react-icons/fa6';
import { MdCancel, MdChevronRight, MdDelete, MdReport } from 'react-icons/md';
import { BackButton } from './ui/button';

const testNotis: TNotification[] = [
  {
    type: 'FEED_REPORTED',
    feedId: 0,
    reportCount: 3,
    isRead: false,
    createdAt: subDays(new Date(), 0),
  },
  {
    type: 'FEED_DELETED',
    isRead: false,
    createdAt: subDays(new Date(), 1),
  },
  {
    type: 'FAP_SELECTED',
    selectedDate: '7월 21일',
    isRead: false,
    createdAt: subDays(new Date(), 2),
  },
  {
    type: 'FEED_REPORTED',
    feedId: 0,
    reportCount: 2,
    isRead: true,
    createdAt: subDays(new Date(), 3),
  },
  {
    type: 'FAP_SELECTED',
    selectedDate: '7월 19일',
    isRead: true,
    createdAt: subDays(new Date(), 10),
  },
  {
    type: 'FEED_DELETED',
    isRead: true,
    createdAt: subDays(new Date(), 11),
  },
  {
    type: 'FEED_DELETED',
    isRead: true,
    createdAt: subDays(new Date(), 12),
  },
  {
    type: 'FAP_DELETED',
    deletedFAPCount: 1,
    isRead: true,
    createdAt: subDays(new Date(), 20),
  },
  {
    type: 'FAP_SELECTED',
    selectedDate: '6월 19일',
    isRead: true,
    createdAt: subMonths(new Date(), 1),
  },
];

export function NotificationDialog({ onClose }: DefaultModalProps) {
  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative py-2">
          <BackButton onClick={onClose} />
          <p className="text-center text-2xl font-semibold">알림</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="space-y-3 bg-gray-100 p-5">
        <ul className="flex flex-col gap-3">
          {testNotis.map((noti, index) => (
            <NotificationItem key={`noti-${index}`} {...noti} />
          ))}
        </ul>

        <p className="text-detail text-gray-500">알림은 한 달이 지나면 자동으로 사라져요!</p>
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}

const notiDatas: NotificationDataMap = {
  FEED_REPORTED: {
    IconComponent: MdReport,
    iconColor: 'text-pink-400',
    getMessage: (count: number) => `내 사진에 대한 신고가 있어요. (${count}/5)`,
  },
  FEED_DELETED: {
    IconComponent: MdDelete,
    iconColor: 'text-purple-500',
    getMessage: () => '신고 5회 누적으로 사진이 삭제되었습니다.',
  },
  FAP_SELECTED: {
    IconComponent: FaCrown,
    iconColor: 'text-yellow-800',
    getMessage: (date: string) => `축하합니다! ${date}의 FA:P에 선정되었어요🎉`,
  },
  FAP_DELETED: {
    IconComponent: MdCancel,
    iconColor: 'text-pink-400',
    getMessage: (count: number) => `FA:P에 선정된 사진을 삭제했어요. (${count}/3)`,
  },
};

function NotificationItem(notification: TNotification) {
  const { type, isRead } = notification;
  const { IconComponent, iconColor } = notiDatas[type];

  const isFeedReported = type === 'FEED_REPORTED';

  return (
    <li
      className={cn('flex flex-row items-center gap-3 rounded-lg bg-white px-5 py-3', {
        ['bg-purple-50']: !isRead,
        ['cursor-pointer']: isFeedReported,
      })}>
      {}
      <IconComponent className={`size-6 ${iconColor}`} />
      <div className="flex flex-1 flex-col">
        <p className="text-body">
          {isFeedReportedNotification(notification) && notiDatas[notification.type].getMessage(notification.reportCount)}
          {isFeedDeletedNotification(notification) && notiDatas[notification.type].getMessage()}
          {isFAPSelectedNotification(notification) && notiDatas[notification.type].getMessage(notification.selectedDate)}
          {isFAPDeletedNotification(notification) && notiDatas[notification.type].getMessage(notification.deletedFAPCount)}
        </p>
        {<span className="text-detail text-gray-500">{getRelativeTimeLabel(notification.createdAt)}</span>}
      </div>

      {isFeedReported && <MdChevronRight className="size-6 text-gray-500" />}
    </li>
  );
}
