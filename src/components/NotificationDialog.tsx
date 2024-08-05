import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { requestGetNotifications, requestReadAllNotifications } from '@Services/notification';
import { DefaultModalProps } from '@Stores/modal';
import { InfiniteData, useMutation, useQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import {
  isFAPDeletedNotification,
  isFAPSelectedNotification,
  isFeedDeletedNotification,
  isFeedReportedNotification,
  NotificationDataMap,
  TNotification,
} from '@Types/notification';
import { cn, getRelativeTimeLabel } from '@Utils/index';
import { Suspense, useEffect } from 'react';
import { FaCrown } from 'react-icons/fa6';
import { MdCancel, MdChevronRight, MdDelete, MdReport } from 'react-icons/md';
import { BackButton } from './ui/button';
import { format } from 'date-fns';
import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { SpinLoading } from './SpinLoading';
import { queryClient } from '@Libs/queryclient';
import { AxiosResponse } from 'axios';
import { InfiniteResponse } from '@Types/response';
import { useModalActions } from '@Hooks/modal';
import { FeedDetailDialog } from './FeedDetailDialog';
import { requestGetFeedDetails } from '@Services/feed';

type CachedTNotificationsType = InfiniteData<AxiosResponse<InfiniteResponse<{ notifications: TNotification[] }>>>;

export function NotificationDialog({ onClose }: DefaultModalProps) {
  useEffect(() => {
    return () => {
      queryClient.setQueryData<CachedTNotificationsType>(['notifications'], (prevQuery) =>
        prevQuery
          ? {
              ...prevQuery,
              pages: prevQuery.pages.map((response) => ({
                ...response,
                data: {
                  ...response.data,
                  notifications: response.data.notifications.map((notification) => ({
                    ...notification,
                    isRead: true,
                  })),
                },
              })),
            }
          : undefined
      );
    };
  }, []);

  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative py-2">
          <BackButton onClick={onClose} />
          <p className="text-center text-2xl font-semibold">알림</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="space-y-3 bg-gray-100 p-5">
        <Suspense fallback={<LoadingList />}>
          <NotificationList />
        </Suspense>

        <p className="text-detail text-gray-500">알림은 한 달이 지나면 자동으로 사라져요!</p>
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}

function LoadingList() {
  return (
    <ul className="flex flex-col gap-3">
      <li className="h-[4.3125rem] animate-pulse rounded-lg bg-gray-200" />
      <li className="h-[4.3125rem] animate-pulse rounded-lg bg-gray-200" />
      <li className="h-[4.3125rem] animate-pulse rounded-lg bg-gray-200" />
      <li className="h-[4.3125rem] animate-pulse rounded-lg bg-gray-200" />
      <li className="h-[4.3125rem] animate-pulse rounded-lg bg-gray-200" />
    </ul>
  );
}

function NotificationList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }) => requestGetNotifications({ nextCursor: pageParam }),
    staleTime: 1000 * 60 * 10, // 10분
    getNextPageParam({ data: { nextCursor } }) {
      return nextCursor !== null ? nextCursor : undefined;
    },
    initialPageParam: -1,
  });

  const { mutate: readAllNotifications } = useMutation({
    mutationKey: ['readAllNotifications'],
    mutationFn: requestReadAllNotifications,
  });

  const { disconnect } = useInfiniteObserver({
    parentNodeId: 'notificationList',
    onIntersection: fetchNextPage,
  });

  useEffect(() => {
    readAllNotifications();
    return () => disconnect();
  }, []);

  useEffect(() => {
    !hasNextPage && disconnect();
  }, [hasNextPage]);

  const hasNoNotification = data.pages.at(0)?.data.notifications.length === 0;

  return (
    <ul id="notificationList" className="flex flex-col gap-3">
      {hasNoNotification && <p className="text-gray-700">표시할 알림이 없습니다.</p>}
      {data.pages.map((page) => page.data.notifications.map((notification) => <NotificationItem key={`noti-${notification.id}`} {...notification} />))}
      {isFetchingNextPage && <SpinLoading />}
    </ul>
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
  const { showModal } = useModalActions();

  const isFeedReported = type === 'FEED_REPORTED';

  const { data } = useQuery({
    queryKey: ['feed', 'detail', notification.feedId],
    queryFn: () => requestGetFeedDetails({ feedId: notification.feedId! }),
    enabled: isFeedReported,
  });

  const handleClick = async () => {
    if (isFeedReported) {
      await showModal({ type: 'fullScreenDialog', animateType: 'slideInFromRight', Component: FeedDetailDialog, props: { feeds: [data] } });
    }
  };

  return (
    <li
      className={cn('flex flex-row items-center gap-3 rounded-lg bg-white px-5 py-3', {
        ['bg-purple-50']: !isRead,
        ['cursor-pointer']: isFeedReported,
      })}
      onClick={handleClick}>
      {}
      <IconComponent className={`size-6 ${iconColor}`} />
      <div className="flex flex-1 flex-col">
        <p className="text-body">
          {isFeedReportedNotification(notification) && notiDatas[notification.type].getMessage(notification.reportCount)}
          {isFeedDeletedNotification(notification) && notiDatas[notification.type].getMessage()}
          {isFAPSelectedNotification(notification) && notiDatas[notification.type].getMessage(format(notification.selectedDate, 'yyyy년 MM월'))}
          {isFAPDeletedNotification(notification) && notiDatas[notification.type].getMessage(notification.deletedFAPCount)}
        </p>
        {<span className="text-detail text-gray-500">{getRelativeTimeLabel(new Date(notification.createdAt))}</span>}
      </div>

      {isFeedReported && <MdChevronRight className="size-6 text-gray-500" />}
    </li>
  );
}
