import { FeedDetailCard } from '@Components/FeedDetailCard';
import { ShowNotificationButton } from '@Components/ShowNotificationButton';
import { SpinLoading } from '@Components/SpinLoading';
import { Avatar } from '@Components/ui/avatar';
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

export default function Page() {
  useHeader({ title: '구독', rightSlot: () => <ShowNotificationButton /> });

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative h-fit w-full px-5 py-4">
        <Suspense fallback={<SpinLoading />}>
          <SubscriberList />
        </Suspense>
        <ShowSubscribeListViewButton />
      </div>

      <Suspense fallback={<SpinLoading />}>
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
      return nextCursor || undefined;
    },
    initialPageParam: -1,
  });

  useEffect(() => {
    if (!isPending) {
      resetObserve();
    }

    setLeftSlot(() => isFetchingNextPage && <VscLoading className="size-6 animate-spin" />);
  }, [isPending, isFetchingNextPage]);

  const { disconnect: disconnectObserver, resetObserve } = useInfiniteObserver({
    parentNodeId: 'feedList',
    onIntersection: fetchNextPage,
  });

  useEffect(() => {
    !hasNextPage && disconnectObserver();
  }, [hasNextPage]);

  return (
    <div className="relative min-h-1 flex-1 snap-y snap-mandatory overflow-y-scroll">
      <div id="feedList" className="h-full">
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
      return nextCursor || undefined;
    },
    initialPageParam: -1,
  });

  return (
    <div className="flex w-full overflow-y-scroll pr-10">
      <ul className="flex flex-row gap-3">
        {data?.pages.map((page) => page.subscribers.map((subscriber) => <SubscriberItem key={`subscriber-${subscriber.userId}`} {...subscriber} />))}
      </ul>
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
