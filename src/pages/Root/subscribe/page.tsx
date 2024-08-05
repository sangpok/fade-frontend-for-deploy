import { FeedDetailCard } from '@Components/FeedDetailCard';
import { ShowNotificationButton } from '@Components/ShowNotificationButton';
import { Avatar } from '@Components/ui/avatar';
import { Skeleton } from '@Components/ui/skeleton';
import { useHeader } from '@Hooks/useHeader';
import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { requestGetSubscribeFeeds } from '@Services/feed';
import { requestGetSubscribers } from '@Services/member';
import { useHeaderStore } from '@Stores/header';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { TSubscriber } from '@Types/model';
import { cn } from '@Utils/index';
import { Suspense, useEffect } from 'react';
import { MdChevronRight } from 'react-icons/md';
import { VscLoading } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';

function SubscriberListSkeleton() {
  return (
    <div className="flex flex-row gap-3 p-4">
      <Skeleton className="h-[3.125rem] flex-1" />
      <Skeleton className="h-[3.125rem] flex-1" />
      <Skeleton className="h-[3.125rem] flex-1" />
      <Skeleton className="h-[3.125rem] flex-1" />
      <Skeleton className="h-[3.125rem] flex-1" />
    </div>
  );
}

function SubscribeFeedListSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-5">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="flex-1" />
    </div>
  );
}

export default function Page() {
  useHeader({ title: '구독', rightSlot: () => <ShowNotificationButton /> });

  return (
    <div className="relative flex h-full flex-col">
      <Suspense fallback={<SubscriberListSkeleton />}>
        <div className="relative h-fit w-full px-5 py-4">
          <SubscriberList />
        </div>
      </Suspense>

      <Suspense fallback={<SubscribeFeedListSkeleton />}>
        <SubscribeFeedList />
      </Suspense>
    </div>
  );
}

function ShowSubscribeListViewButton() {
  const navigate = useNavigate();

  return (
    <button className="absolute right-5 top-1/2 -translate-y-1/2 bg-fade-gradient px-2 py-4" onClick={() => navigate('/subscribe/list')}>
      <MdChevronRight className="size-6" />
    </button>
  );
}

function SubscribeFeedList() {
  const setLeftSlot = useHeaderStore((state) => state.setLeftSlot);

  const { data, fetchNextPage, isFetchingNextPage, isPending, hasNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['subscribe', 'list'],
    queryFn: ({ pageParam }) => requestGetSubscribeFeeds({ nextCursor: pageParam }),
    getNextPageParam({ nextCursor }) {
      return nextCursor !== null ? nextCursor : undefined;
    },
    initialPageParam: -1,
  });

  useEffect(() => {
    setLeftSlot(() => isFetchingNextPage && <VscLoading className="size-6 animate-spin" />);
  }, [isPending, isFetchingNextPage]);

  const { disconnect: disconnectObserver } = useInfiniteObserver({
    parentNodeId: 'feedList',
    onIntersection: fetchNextPage,
  });

  useEffect(() => {
    !hasNextPage && disconnectObserver();
  }, [hasNextPage]);

  const hasNoFeed = data.pages.at(0)?.feeds.length === 0;

  return (
    <div className="relative min-h-1 flex-1 snap-y snap-mandatory overflow-y-scroll">
      <div id="feedList" className="h-full">
        {hasNoFeed && <p className="pl-5">아직 구독하는 페이더가 없으시군요? 첫 구독을 해보세요!</p>}
        {data && data.pages.map((page) => page.feeds.map((feedDetail) => <FeedDetailCard key={feedDetail.id} {...feedDetail} />))}
      </div>
    </div>
  );
}

export function SubscriberList() {
  const { data } = useSuspenseInfiniteQuery({
    queryKey: ['subscribe', 'subscribers'],
    queryFn: ({ pageParam }) => requestGetSubscribers({ nextCursor: pageParam }),
    getNextPageParam({ nextCursor }) {
      return nextCursor !== null ? nextCursor : undefined;
    },
    initialPageParam: -1,
  });

  const hasNoSubscribe = data.pages.at(0)?.subscribers.length === 0;
  const isOverFive = data.pages.at(0)?.subscribers.length || 0 > 5;

  if (hasNoSubscribe) {
    return;
  }

  return (
    <div className="flex w-full overflow-y-scroll pr-10">
      <ul className="flex flex-row gap-3">
        {hasNoSubscribe && <p>첫 구독</p>}
        {data?.pages.map((page) => page.subscribers.slice(0, 5).map((subscriber) => <SubscriberItem key={`subscriber-${subscriber.userId}`} {...subscriber} />))}
      </ul>

      {isOverFive && <ShowSubscribeListViewButton />}
    </div>
  );
}

function SubscriberItem({ username, profileImageURL, userId }: TSubscriber) {
  return (
    <li
      className={cn('boder-gray-200 flex h-full flex-row items-center gap-2 rounded-lg border p-2', {
        ['border-purple-100 bg-purple-50']: userId === 0,
      })}>
      <Avatar src={profileImageURL} size="32" />
      <span>{username}</span>
    </li>
  );
}
