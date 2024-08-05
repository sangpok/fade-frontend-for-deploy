import { FeedDetailDialog } from '@Components/FeedDetailDialog';
import { SpinLoading } from '@Components/SpinLoading';
import { Grid } from '@Components/ui/grid';
import { Image } from '@Components/ui/image';
import { Skeleton } from '@Components/ui/skeleton';
import { useModalActions } from '@Hooks/modal';
import { useHeader } from '@Hooks/useHeader';
import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { requestGetBookmarkFeeds } from '@Services/feed';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { TFeed } from '@Types/model';
import { Suspense, useEffect } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function Page() {
  useHeader({
    title: '북마크',
    leftSlot: () => <BackButton />,
  });

  return (
    <Suspense fallback={<BookmarkFeedsSkeleton />}>
      <BookmarkFeeds />
    </Suspense>
  );
}

function BookmarkFeedsSkeleton() {
  return (
    <Grid cols={3}>
      <Skeleton className="aspect-[3/4] flex-1" />
      <Skeleton className="aspect-[3/4] flex-1" />
      <Skeleton className="aspect-[3/4] flex-1" />
      <Skeleton className="aspect-[3/4] flex-1" />
      <Skeleton className="aspect-[3/4] flex-1" />
      <Skeleton className="aspect-[3/4] flex-1" />
    </Grid>
  );
}

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      className="group cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100"
      onClick={() => navigate('/mypage', { replace: true })}>
      <MdChevronLeft className="size-6 transition-transform group-active:scale-95" />
    </button>
  );
}

function BookmarkFeeds() {
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['user', 'me', 'bookmark'],
    queryFn: ({ pageParam }) => requestGetBookmarkFeeds({ nextCursor: pageParam }),
    getNextPageParam({ nextCursor }) {
      return nextCursor !== null ? nextCursor : undefined;
    },
    initialPageParam: -1,
  });

  const { disconnect: disconnectObserver } = useInfiniteObserver({
    parentNodeId: 'feedList',
    onIntersection: fetchNextPage,
  });

  useEffect(() => {
    !hasNextPage && disconnectObserver();
  }, [hasNextPage]);

  return (
    <div className="space-y-10 p-1">
      <Grid id="feedList" cols={3}>
        {data?.pages.map((page) => page.feeds.map((feed, index) => <FeedItem key={`feed-item-${feed.id}`} {...feed} feeds={page.feeds} index={index} />))}
      </Grid>

      {isFetchingNextPage && <SpinLoading />}
      {!isPending && !hasNextPage && <p className="text-detail text-gray-700">내 모든 북마크를 불러왔어요.</p>}
    </div>
  );
}

interface TFeedItem {
  feeds: TFeed[];
  index: number;
}

type FeedItemProps = TFeedItem & TFeed;

function FeedItem({ feeds, index, ...feed }: FeedItemProps) {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    await showModal({ type: 'fullScreenDialog', animateType: 'slideInFromRight', Component: FeedDetailDialog, props: { feeds, defaultViewIndex: index } });
  };

  return (
    <div key={`item-${feed.id}`} className="group aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-lg" onClick={handleClick}>
      <Image src={feed.imageURL} className="h-full w-full transition-transform group-hover:scale-105" />
    </div>
  );
}
