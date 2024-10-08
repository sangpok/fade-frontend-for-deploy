import { useModalActions } from '@Hooks/modal';
import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { requestGetUserFeeds } from '@Services/feed';
import { requestGetFeedUserDetails } from '@Services/member';
import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { TFeed } from '@Types/model';
import { Suspense, useEffect } from 'react';
import { MdEditNote } from 'react-icons/md';
import { FeedDetailDialog } from './FeedDetailDialog';
import { IntroduceContentEditBottomSheet } from './IntroduceContentEditBottomSheet';
import { UserDetailSkeletonUI, UserFeedsSkeletonUI } from './ProfileDetails.skeleton';
import { SpinLoading } from './SpinLoading';
import { SubscribeButton } from './SubscribeButton';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';
import { Grid } from './ui/grid';
import { Image } from './ui/image';

export type ProfileViewType = 'owner' | 'user';

interface TProfileDetails {
  userId: number;
  viewType: ProfileViewType;
}

type ProfileDetailsProps = TProfileDetails;

export function ProfileDetails({ viewType, userId }: ProfileDetailsProps) {
  return (
    <div>
      <Suspense fallback={<UserDetailSkeletonUI />}>
        <UserDetail userId={userId} viewType={viewType} />
      </Suspense>

      <Suspense fallback={<UserFeedsSkeletonUI />}>
        <UserFeeds userId={userId} />
      </Suspense>
    </div>
  );
}

function UserDetail({ userId, viewType }: { userId: number; viewType: ProfileViewType }) {
  const isOwnerView = viewType === 'owner';
  const isUserView = viewType === 'user';

  const {
    data: { data },
  } = useSuspenseQuery({
    queryKey: ['user', userId, 'detail'],
    queryFn: () => requestGetFeedUserDetails({ userId }),
  });

  const { username, introduceContent, profileImageURL, subscribedCount, isSubscribed } = data;

  return (
    <div className="space-y-5 p-5">
      <div className="flex flex-row items-center gap-3">
        <Avatar src={profileImageURL} size="72" />

        <div className="flex flex-1 flex-col justify-center">
          <span className="font-semibold">{username}</span>

          <div className="space-x-2">
            <span>구독자</span>
            <span>{subscribedCount}</span>
          </div>
        </div>

        {isUserView && <SubscribeButton userId={userId} initialSubscribedStatus={isSubscribed} onToggle={() => {}} size="lg" />}
      </div>

      <div className="flex flex-col">
        <p className="whitespace-pre-line">{introduceContent}</p>

        {isOwnerView && <EditIntroduceContentButton defaultIntroduceContent={introduceContent} />}
      </div>
    </div>
  );
}

interface TEditIntroduceContentButton {
  defaultIntroduceContent: string;
}

type EditIntroduceContentButtonProps = TEditIntroduceContentButton;

function EditIntroduceContentButton({ defaultIntroduceContent }: EditIntroduceContentButtonProps) {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    await showModal({ type: 'bottomSheet', Component: IntroduceContentEditBottomSheet, props: { defaultIntroduceContent } });
  };

  return (
    <Button variants="ghost" size="icon" className="ml-auto w-fit" onClick={handleClick}>
      <MdEditNote className="size-6" />
    </Button>
  );
}

function UserFeeds({ userId }: { userId: number }) {
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['user', userId, 'feed'],
    queryFn: ({ pageParam }) => requestGetUserFeeds({ userId, nextCursor: pageParam }),
    getNextPageParam({ nextCursor }) {
      return nextCursor !== null ? nextCursor : undefined;
    },
    initialPageParam: -1,
  });

  const { disconnect: disconnectObserver } = useInfiniteObserver({
    parentNodeId: 'feedList',
    onIntersection: fetchNextPage,
  });

  const allFeeds = data?.pages.flatMap(({ feeds }) => feeds.map((feed) => feed));

  useEffect(() => {
    !hasNextPage && disconnectObserver();
  }, [hasNextPage]);

  return (
    <div className="space-y-10 p-1">
      <Grid id="feedList" cols={3}>
        {allFeeds.map((feed, index) => (
          <FeedItem key={`item-${feed.id}`} feeds={allFeeds} index={index} {...feed} />
        ))}
      </Grid>

      {isFetchingNextPage && <SpinLoading />}
      {!isPending && !hasNextPage && <p className="text-detail text-gray-700">모든 피드를 불러왔어요.</p>}
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
