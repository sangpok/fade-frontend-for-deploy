import { SpinLoading } from '@Components/SpinLoading';
import { SubscribeButton } from '@Components/SubscribeButton';
import { Avatar } from '@Components/ui/avatar';
import { BackButton } from '@Components/ui/button';
import { useHeader } from '@Hooks/useHeader';
import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { requestGetSubscribers } from '@Services/member';
import { useInfiniteQuery } from '@tanstack/react-query';
import { TSubscriber } from '@Types/model';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Page() {
  useHeader({
    title: '구독 목록',
    leftSlot: () => <BackButton className="left-0" onClick={() => navigate('/subscribe', { replace: true })} />,
  });

  const navigate = useNavigate();

  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['subscribe', 'subscribers'],
    queryFn: ({ pageParam }) => requestGetSubscribers({ nextCursor: pageParam }),
    getNextPageParam({ nextCursor }) {
      return nextCursor || undefined;
    },
    initialPageParam: -1,
  });

  const { disconnect: disconnectObserver, resetObserve } = useInfiniteObserver({
    parentNodeId: 'subscriberList',
    onIntersection: fetchNextPage,
  });

  useEffect(() => {
    resetObserve();
  }, [isPending, isFetchingNextPage]);

  useEffect(() => {
    !hasNextPage && disconnectObserver();
  }, [hasNextPage]);

  return (
    <div className="relative flex h-full flex-col space-y-8">
      <ul id="subscriberList">
        {data?.pages.map((page) => page.subscribers.map((subscriber) => <SubscribeItem key={`subscriber-${subscriber.userId}`} {...subscriber} />))}
      </ul>

      {isFetchingNextPage && <SpinLoading />}
      {isPending && !hasNextPage && <p className="pl-3 text-detail text-gray-700">모든 페이더들의 패션을 불러왔어요.</p>}
    </div>
  );
}

function SubscribeItem({ username, profileImageURL, userId }: TSubscriber) {
  return (
    <div className="infiniteItem fle-row flex items-center gap-3 rounded-lg bg-white p-3">
      <Avatar src={profileImageURL} size="40" />
      <p className="flex-1">{username}</p>
      <SubscribeButton userId={userId} initialSubscribedStatus={true} onToggle={() => {}} size="lg" />
    </div>
  );
}
