import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { TFeed } from '@Types/model';
import { FeedDetailCard } from './FeedDetailCard';
import { BackButton } from './ui/button';
import { useEffect, useRef } from 'react';

export type FeedDetailDialgoViewType = 'default' | 'fapArchiving' | 'voteHistory';

interface TFeedDetailDialog {
  feeds: TFeed[];
  defaultViewIndex: number;
  viewType?: FeedDetailDialgoViewType;
}

type FeedDialogDialogProps = DefaultModalProps<void, TFeedDetailDialog>;

export function FeedDetailDialog({ feeds, defaultViewIndex = 0, viewType = 'default', isStartAnimtionEnd, onClose }: FeedDialogDialogProps) {
  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative py-2">
          <BackButton onClick={onClose} />
          <p className="text-center text-2xl font-semibold">사진 상세</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content>
        <Feeds
          feeds={feeds}
          viewType={viewType}
          defaultViewIndex={defaultViewIndex}
          onUsernameClicked={onClose}
          isStartAnimtionEnd={isStartAnimtionEnd}
          onFeedEdited={onClose}
          onFeedDeleted={onClose}
          onFeedReported={onClose}
        />
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}

interface TFeeds {
  feeds: TFeed[];
  defaultViewIndex: number;
  viewType: FeedDetailDialgoViewType;
  isStartAnimtionEnd: boolean;
  onUsernameClicked: () => void;
  onFeedEdited: () => void;
  onFeedDeleted: () => void;
  onFeedReported: () => void;
}

type FeedsProps = TFeeds;

function Feeds({ feeds, defaultViewIndex, viewType, isStartAnimtionEnd, onUsernameClicked, onFeedEdited, onFeedDeleted, onFeedReported }: FeedsProps) {
  const feedListRef = useRef<HTMLDivElement>(null);

  const beforeFeeds = feeds
    .slice(0, defaultViewIndex)
    .map((feedDetail, index) => (
      <FeedDetailCard
        key={feedDetail.id}
        {...feedDetail}
        feedIndex={index}
        viewType={viewType}
        isStartAnimtionEnd={isStartAnimtionEnd}
        onUsernameClicked={onUsernameClicked}
        onFeedEdited={onFeedEdited}
        onFeedDeleted={onFeedDeleted}
        onFeedReported={onFeedReported}
      />
    ));

  const afterFeeds = feeds
    .slice(defaultViewIndex + 1)
    .map((feedDetail, index) => (
      <FeedDetailCard
        key={feedDetail.id}
        {...feedDetail}
        feedIndex={defaultViewIndex + index}
        viewType={viewType}
        isStartAnimtionEnd={isStartAnimtionEnd}
        onUsernameClicked={onUsernameClicked}
        onFeedEdited={onFeedEdited}
        onFeedDeleted={onFeedDeleted}
        onFeedReported={onFeedReported}
      />
    ));

  const targetFeed = feeds[defaultViewIndex];

  useEffect(() => {
    const mutationObserver = new MutationObserver(() => {
      const targetFeed = feedListRef.current!.querySelector(`div[data-feed-index='${defaultViewIndex}']`)!;

      targetFeed.scrollIntoView({ behavior: 'instant' });
      mutationObserver.disconnect();
    });

    mutationObserver.observe(feedListRef.current!, { childList: true });
  }, []);

  return (
    <div ref={feedListRef} id="feedList" className="h-full snap-y snap-mandatory overflow-y-scroll">
      {isStartAnimtionEnd && beforeFeeds}
      <FeedDetailCard
        key={targetFeed.id}
        {...targetFeed}
        feedIndex={defaultViewIndex}
        viewType={viewType}
        isStartAnimtionEnd={isStartAnimtionEnd}
        onUsernameClicked={onUsernameClicked}
        onFeedEdited={onFeedEdited}
        onFeedDeleted={onFeedDeleted}
      />
      {isStartAnimtionEnd && afterFeeds}
    </div>
  );
}
